import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js'; // Import Fuse.js
import Navbar from '../Components/Navbar';
import UserBlock from '../Components/UserBlock';
import BaseUrl from '../const';

const AllParticipant = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name'); // 'name' or 'college'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const fuse = new Fuse(users, {
    keys: ['name', 'collegeName'], // Fuzzy search on both name and collegeName
    threshold: 0.4, // Adjust sensitivity (lower is stricter)
  });

  const handleHallAllot = async (userId, hall) => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/allotHall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, Hall: hall, token: localStorage.getItem('Admintoken') }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`Hall ${hall} allotted to user ${userId}`);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error allotting hall:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/admin/allusers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: localStorage.getItem('Admintoken') }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const sortedUsers = data.users.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Perform fuzzy search based on the selected category
    if (value.trim() === '') {
      setFilteredUsers(users);
    } else {
      const result = fuse.search(value).map(({ item }) => item); // Fuzzy search result
      setFilteredUsers(result);
    }

    setCurrentPage(1); // Reset to the first page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Get current users based on the current page and filtered users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <Navbar />
      <div className="search-bar flex flex-col items-center mt-4 mb-4">
        <div className="flex space-x-4">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="name">Search by Name</option>
            <option value="collegeName">Search by College</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={`Search participants by ${searchCategory}`}
            className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          />
        </div>
      </div>

      <div className="participants-list">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <UserBlock
              key={user._id}
              name={user.name}
              id={user._id}
              college={user.collegeName}
              user={user}
              onHallAllot={handleHallAllot}
            />
          ))
        ) : (
          <p>No participants found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <ul className="flex space-x-2">
            {[...Array(totalPages).keys()].map((num) => (
              <li key={num + 1}>
                <button
                  onClick={() => paginate(num + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === num + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } hover:bg-blue-300`}
                >
                  {num + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AllParticipant;
