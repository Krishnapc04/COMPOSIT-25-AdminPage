import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import Navbar from '../Components/Navbar';
import BaseUrl from '../const';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState('Metaclix');
  const [eventData, setEventData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const events = [
    'Metaclix', 'Excavate', 'CaseStudy', 'Enigma', 'Technova', 
    'Ideathon', 'CadVolution', 'MetaCode'
  ];

  const token = localStorage.getItem('Admintoken');
  const viewMore = async (id) => {
    try {
      const response =await fetch(`${BaseUrl}/api/admin/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId:id,
          token:token
        })
      })
      const data = await response.json();
      const user = data.user

      navigate(`/user/${id}`, { state: { user } }); // Pass the user data through state

    } catch (error) {
      console.error("Error finding user:", error);

    }
  }

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
        setFilteredTeams(data.event.Teams);
      } catch (err) {
        setError(err.message);
        setEventData(null);
        setFilteredTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [selectedEvent]);

  useEffect(() => {
    if (!eventData || !eventData.Teams) return;

    const fuse = new Fuse(eventData.Teams, {
      keys: ['teamName', 'teamId', 'members.name'],
      threshold: 0.3,
    });

    if (searchQuery.trim() === '') {
      setFilteredTeams(eventData.Teams);
    } else {
      const results = fuse.search(searchQuery).map(result => result.item);
      setFilteredTeams(results);
    }
  }, [searchQuery, eventData]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
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

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-6">
          <input
            type="text"
            placeholder="Search by Team Name, Team ID, or Participant Name"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full max-w-2xl p-4 border rounded-lg shadow-md bg-white">
          {loading && <p>Loading event information...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {eventData ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {eventData.eventName} : ({filteredTeams.length} Registrations)
              </h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Teams:</h3>
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team, index) => (
                    <div key={index} className="p-4 border rounded-md bg-gray-50">
                      <h4 className="text-md font-medium text-gray-800">Team Name: {team.teamName}</h4>
                      <p className="text-sm text-gray-600">Team ID: {team.teamId}</p>
                      <h5 className="text-md font-semibold text-gray-700 mt-2">Members:</h5>
                      <ul className="list-disc list-inside">
                        {team.members.map((member, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {member.name} ({member.role}) - {member.email} <b className='cursor-pointer' onClick={() => viewMore(member.memberId)}> - (view more)</b>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No teams match your search.</p>
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