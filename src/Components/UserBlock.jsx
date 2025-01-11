import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserBlock = ({ name, id, college, user }) => {

  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate(`/user/${id}`, { state: { user } }); // Pass the user data through state
  };

    return (
        <div className="flex flex-wrap items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-xl mx-auto mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              <span className="font-semibold">Name:</span> {name}
            </p>
            <p className="text-sm text-gray-600 truncate">
              <span className="font-semibold">ID:</span> {id}
            </p>
            <p className="text-sm text-gray-600 truncate">
              <span className="font-semibold">College:</span> {college}
            </p>
          </div>
          <div className="flex flex-shrink-0 space-x-2 mt-2 sm:mt-0">
            <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">
              Mark Present
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600" onClick={handleViewMore}>
              View More
            </button>
          </div>
        </div>
      );
}

export default UserBlock
