import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import BaseUrl from '../const';
import { useNavigate } from 'react-router-dom';

const SaPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [SaData, setSaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/admin/getSA`, {
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
        const sortedUsers = data.SA.sort((a, b) => a.name.localeCompare(b.name));
        setSaData(sortedUsers);
        setFilteredData(sortedUsers); // Initialize filtered data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter by search query
    const filtered = SaData.filter((sa) =>
      sa.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, SaData]);

  const handleSort = () => {
    const sorted = [...filteredData].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.SaMember.length - b.SaMember.length
        : b.SaMember.length - a.SaMember.length;
    });
    setFilteredData(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleClick = async (id) => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id, token: localStorage.getItem('Admintoken') }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const getuser = await response.json();
      const user = getuser.user;
      navigate(`/user/${id}`, { state: { user } });
    } catch (err) {
      console.error('Failed to fetch user:', err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Student Ambassadors</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Sort Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleSort}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Sort by Registrations ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
        </div>

        <ul>
          {currentItems.map((sa, index) => (
            <li key={index} className="mb-4 border p-4 rounded-lg">
              <div className="flex justify-around">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    <span className="font-semibold">Name:</span> {sa.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">ID:</span> {sa._id}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">Referral Id:</span> {sa.SaId}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">College:</span> {sa.collegeName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">Total Registrations:</span> {sa.SaMember.length}
                  </p>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 w-full">
                    Members
                  </summary>
                  <ul className="ml-4 mt-2">
                    {sa.SaMember.map((member, idx) => (
                      <li key={idx} className="mb-2">
                        {member.MemberName}{' '}
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                          onClick={() => {
                            handleClick(member.MemberId);
                          }}
                        >
                          View More
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-6">
          <nav>
            <ul className="inline-flex space-x-2">
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SaPage;
