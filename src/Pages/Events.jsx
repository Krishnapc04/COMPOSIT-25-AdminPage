import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import BaseUrl from '../const';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState('MetaClix');
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const events = [
    'MetaClix', 'Excavate', 'CaseStudy', 'Enigma', 'Technova', 
    'Ideathon', 'MarketMaterial', 'MetaCode', 'Simulation'
  ];

  // Fetch event data when selectedEvent changes
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BaseUrl}/api/admin/eventinfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventName: selectedEvent,
            token: localStorage.getItem('Admintoken'),
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setEventData(data.event);
      } catch (err) {
        setError(err.message);
        setEventData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [selectedEvent]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        {/* Dropdown */}
        <div className="w-full max-w-xs mb-6">
          <label htmlFor="event-dropdown" className="block text-lg font-medium text-gray-700 mb-2">
            Select an Event
          </label>
          <select
            id="event-dropdown"
            className="block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            {events.map((event, index) => (
              <option key={index} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>

        {/* Event Info */}
        <div className="w-full max-w-2xl p-4 border rounded-lg shadow-md bg-white">
          {loading && <p>Loading event information...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {eventData ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{eventData.eventName}</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Teams:</h3>
                {eventData.Teams.length > 0 ? (
                  eventData.Teams.map((team, index) => (
                    <div key={index} className="p-4 border rounded-md bg-gray-50">
                      <h4 className="text-md font-medium text-gray-800">Team Name: {team.teamName}</h4>
                      <p className="text-sm text-gray-600">Team ID: {team.teamId}</p>
                      <h5 className="text-md font-semibold text-gray-700 mt-2">Members:</h5>
                      <ul className="list-disc list-inside">
                        {team.members.map((member, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {member.name} ({member.role}) - {member.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No teams registered for this event.</p>
                )}
              </div>
            </>
          ) : (
            !loading && <p className="text-gray-600">Select an event to view its details.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Events;
