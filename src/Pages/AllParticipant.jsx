import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Navbar from '../Components/Navbar';
import UserBlock from '../Components/UserBlock';
import BaseUrl from '../const';

const AllParticipant = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showNonSaUsers, setShowNonSaUsers] = useState(false);

  const fuse = new Fuse(users, {
    keys: ['name', 'collegeName', 'state'],
    threshold: 0.5,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/admin/allusers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: localStorage.getItem('Admintoken') }),
        });

        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredUsers(users);
    } else {
      const result = fuse.search(value).map(({ item }) => item);
      setFilteredUsers(result);
    }

    setCurrentPage(1);
  };

  const handleShowNonSaUsers = () => {
    if (showNonSaUsers) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.Sa === false));
    }
    setShowNonSaUsers(!showNonSaUsers);
    setCurrentPage(1);
  };

  const sortByRegistrationTime = () => {
    const sorted = [...filteredUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredUsers(sorted);
  };

  const sortByName = () => {
    const sorted = [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
    setFilteredUsers(sorted);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      <Navbar />
      
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold">Total Registered Users: {filteredUsers.length}</h2>
      </div>

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
          <button
            onClick={handleShowNonSaUsers}
            className={`px-4 py-2 rounded-md ${showNonSaUsers ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} hover:bg-blue-300`}
          >
            {showNonSaUsers ? 'Show All Users' : 'Show Non-Sa Users'}
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        <button onClick={sortByRegistrationTime} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400">
          Sort by Registration Time
        </button>
        <button onClick={sortByName} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400">
          Sort by Name
        </button>
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
            />
          ))
        ) : (
          <p>No participants found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <ul className="flex space-x-2">
            {[...Array(totalPages).keys()].map((num) => (
              <li key={num + 1}>
                <button
                  onClick={() => paginate(num + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-300`}
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
