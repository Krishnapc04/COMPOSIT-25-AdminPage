import React, { useEffect, useState } from 'react';
import BaseUrl from '../const';
import Navbar from '../Components/Navbar';

const Accomodation = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('arrivalDate'); // Default sorting by Arrival Date

  const token = localStorage.getItem('Admintoken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseUrl}/api/admin/getAccomodation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        const users = result.user ? (Array.isArray(result.user) ? result.user : [result.user]) : [];

        setData(users);
        setFilteredData(users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Search
  useEffect(() => {
    const filtered = data.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  // Handle Sorting
  useEffect(() => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOption === 'arrivalDate') {
        return new Date(a.arrivalDate) - new Date(b.arrivalDate);
      } else if (sortOption === 'days') {
        return a.days - b.days;
      } else if (sortOption === 'events') {
        const eventA = a.events?.[0]?.eventName?.toLowerCase() || '';
        const eventB = b.events?.[0]?.eventName?.toLowerCase() || '';
        return eventA.localeCompare(eventB);
      }
      return 0;
    });
  
    setFilteredData(sortedData);
  }, [sortOption, data]);

  return (
    <>
      <Navbar/>
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Accommodation Portal</h1>

        {/* Search and Sort Options */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Search by Name or COMPOSIT ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px',
              width: '50%',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="arrivalDate">Sort by Arrival Date</option>
            <option value="days">Sort by Number of Days</option>
            <option value="events">Sort by Event Name</option>
          </select>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#007BFF', color: 'white', textAlign: 'center' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>COMPOSIT ID</th>
                <th style={thStyle}>Days</th>
                <th style={thStyle}>Arrival Time</th>
                <th style={thStyle}>Arrival Date</th>
                <th style={thStyle}>Registered Events</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((user, index) => (
                  <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff', textAlign: 'center' }}>
                    <td style={tdStyle}>{user.name}</td>
                    <td style={tdStyle}>{user._id}</td>
                    <td style={tdStyle}>{user.days}</td>
                    <td style={tdStyle}>{user.arrival}</td>
                    <td style={tdStyle}>{user.arrivalDate}</td>
                    <td style={tdStyle}>{user.comingEvent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

// Table header styling
const thStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  fontSize: '16px',
};

// Table cell styling
const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

export default Accomodation;
