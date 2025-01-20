import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import BaseUrl from '../const';

const Halls = () => {
  const [selectedHall, setSelectedHall] = useState('LLR');
  const [hallUsers, setHallUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allHalls = ['LLR', 'MS', 'Azad', 'MMM', 'SNVH', 'MT', 'Patel', 'Nehru'];

  // Fetch users allotted to the selected hall
  useEffect(() => {
    const fetchHallUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BaseUrl}/api/admin/HallsInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            HallName: selectedHall,
            token: localStorage.getItem('Admintoken'),
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setHallUsers(data.Users || []); // Update the users for the selected hall
        console.log(hallUsers)
      } catch (err) {
        setError(err.message);
        setHallUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHallUsers();
  }, [selectedHall]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        {/* Dropdown */}
        <div className="w-full max-w-xs mb-6">
          <label htmlFor="halls-dropdown" className="block text-lg font-medium text-gray-700 mb-2">
            Select a Hall
          </label>
          <select
            id="halls-dropdown"
            className="block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
          >
            {allHalls.map((hall, index) => (
              <option key={index} value={hall}>
                {hall}
              </option>
            ))}
          </select>
        </div>

        {/* Hall Users */}
        <div className="w-full max-w-2xl p-4 border rounded-lg shadow-md bg-white">
          {loading && <p>Loading users...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {hallUsers.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Users in {selectedHall} Hall</h2>
              {hallUsers.map((user, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50">
                  <h3 className="text-md font-medium text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">Contact: {user.phone}</p>
                  <p className="text-sm text-gray-600">Registration ID: {user._id}</p>
                </div>

              ))}
            </div>
          ) : (
            !loading && <p className="text-gray-600">No users allocated to this hall.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Halls;
