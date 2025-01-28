import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import BaseUrl from '../const';
import { useNavigate } from 'react-router-dom';

const SaPage = () => {
  const navigate = useNavigate();

  const [SaData, setSaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'approved'
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setFilteredData(sortedUsers);
        setApprovedData(sortedUsers.filter((sa) => sa.ApprovedSa));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
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

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SaId: id, token: localStorage.getItem('Admintoken') }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedSa = await response.json();
      setSaData(
        SaData.map((sa) => (sa.SaId === id ? { ...sa, ApprovedSa: true } : sa))
      );
      setApprovedData(
        SaData.filter((sa) => sa.ApprovedSa || sa.SaId === id)
      );
    } catch (err) {
      console.error('Failed to approve user:', err.message);
    }
  };

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

        {/* Tabs */}
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 mx-2 ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            } rounded-md`}
          >
            All Student Ambassadors
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 mx-2 ${
              activeTab === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            } rounded-md`}
          >
            Approved Student Ambassadors
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'all' && (
          <>
            {/* Search and Sort */}
            <div className="mb-4 flex justify-between">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleSort}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Sort by Registrations ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
              </button>
            </div>

            <ul>
              {filteredData.map((sa) => (
                <li key={sa._id} className="mb-4 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p><strong>Name:</strong> {sa.name}</p>
                      <p><strong>College:</strong> {sa.collegeName}</p>
                      <p><strong>Total Registrations:</strong> {sa.SaMember.length}</p>
                    </div>
                    <button
                    onClick={() => handleApprove(sa.SaId)}
                    disabled={sa.ApprovedSa}
                    className={`mt-2 px-4 py-2 ${
                      sa.ApprovedSa ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'
                    } text-white rounded-md`}
                  >
                    {sa.ApprovedSa ? 'Approved' : 'Approve'}
                  </button>
                  </div>
                  {/* <details>
                    <summary className="cursor-pointer mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
                      View Members
                    </summary>
                    <ul className="ml-4 mt-2">
                      {sa.SaMember.map((member, idx) => (
                        <li key={idx}>
                          {member.MemberName}{' '}
                          <button
                            onClick={() => handleClick(member.MemberId)}
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                          >
                            View More
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details> */}
                </li>
              ))}
            </ul>
          </>
        )}

        {activeTab === 'approved' && (
          <ul>
            {approvedData.map((sa) => (
              <li key={sa._id} className="mb-4 border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>Name:</strong> {sa.name}</p>
                    <p><strong>College:</strong> {sa.collegeName}</p>
                    <p><strong>Total Registrations:</strong> {sa.SaMember.length}</p>
                  </div>
                </div>
                <details>
                  <summary className="cursor-pointer mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm w-1/4 hover:bg-blue-600">
                    View Members
                  </summary>
                  <ul className="ml-4 mt-2">
                    {sa.SaMember.map((member, idx) => (
                      <li key={idx}>
                        {member.MemberName}{' '}
                        <button
                          onClick={() => handleClick(member.MemberId)}
                          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                        >
                          View More
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SaPage;
