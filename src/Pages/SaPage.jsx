import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import BaseUrl from '../const';
import { useNavigate } from 'react-router-dom';

const SaPage = () => {

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [SaData, setSaData] = useState([])
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
        console.log(data.SA)
        const sortedUsers = data.SA.sort((a, b) => a.name.localeCompare(b.name)); // Sort users alphabetically by name
        setSaData(sortedUsers); // Store sorted users
        console.log(SaData)
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

  
  
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = SaData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleClick = async (id) => {
    try {
      const response = await fetch(`${BaseUrl}/api/admin/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: id, token: localStorage.getItem('Admintoken') }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const getuser = await response.json();
      const user = getuser.user
      console.log(user)
      navigate(`/user/${id}`, { state: { user } }); // Navigate to user page with data
    } catch (err) {
      console.error('Failed to fetch user:', err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Student Ambassadors</h1>
        <ul>
          {currentItems.map((sa, index) => (
            <li key={index} className="mb-4 border p-4 rounded-lg">
              <div className='flex justify-around'>
                {/* <h2 className="text-lg font-semibold">{sa.name}</h2> */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    <span className="font-semibold">Name:</span> {sa.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">ID:</span> {sa._id}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">Refferal Id:</span> {sa.SaId}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">College:</span> {sa.collegeName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-semibold">Total Registrations :</span> {sa.SaMember.length}
                  </p>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 w-full">Members</summary>
                  <ul className="ml-4 mt-2">
                    {sa.SaMember.map((member, idx) => (
                      <li key={idx} className="mb-2">
                        {member.MemberName}{' '}
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600" onClick={()=>{handleClick(member.MemberId)}} >
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
              {Array.from({ length: Math.ceil(SaData.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
