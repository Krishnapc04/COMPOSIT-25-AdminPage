import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import UserBlock from '../Components/UserBlock';
import BaseUrl from '../const';

const AllParticipant = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [usersPerPage] = useState(10); // Number of users per page

  // Fetch users on component mount
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
        const sortedUsers = data.users.sort((a, b) => a.name.localeCompare(b.name)); // Sort users alphabetically by name
        setUsers(sortedUsers); // Store sorted users
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Get current users based on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <>
      <Navbar />
      <div className="participants-list">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <UserBlock
              key={user._id}
              name={user.name}
              id={user._id}
              college={user.collegeName}
              user={user}
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
