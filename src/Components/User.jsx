import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const User = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { user } = location.state || {}; // Get the user data from the state

  if (!user) {
    return <p className="text-center text-red-500">No user data provided.</p>;
  }
  const eventNames = user.events.map(event => event.eventName).join(", ");
  console.log(eventNames); 
  
  const handleBack = () => {
    navigate('/allUsers'); // Navigates to the AllParticipants page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to All Users
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Details</h1>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Name:</strong></p>
            <p className="text-lg text-gray-600">{user.name}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>ID:</strong></p>
            <p className="text-lg text-gray-600">{user._id}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Email:</strong></p>
            <p className="text-lg text-gray-600">{user.email}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Phone:</strong></p>
            <p className="text-lg text-gray-600">{user.phone}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Gender:</strong></p>
            <p className="text-lg text-gray-600">{user.gender}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>College:</strong></p>
            <p className="text-lg text-gray-600">{user.collegeName}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Department:</strong></p>
            <p className="text-lg text-gray-600">{user.department}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>City:</strong></p>
            <p className="text-lg text-gray-600">{user.city}, {user.state}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Referral:</strong></p>
            <p className="text-lg text-gray-600">{user.referral}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Events:</strong></p>
            <p className="text-lg text-gray-600">{eventNames}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700"><strong>Created At:</strong></p>
            <p className="text-lg text-gray-600">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
