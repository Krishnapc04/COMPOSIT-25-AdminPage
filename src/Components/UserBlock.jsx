import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseUrl from '../const';

const UserBlock = ({ name, id, college, user, onHallAllot }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState(user.hall || ''); // Default to user's current hall if available
  const navigate = useNavigate();

  const Halls = [
    "LLR",'RP','RK','AZAD','NEHRU','PATEL'
  ]

  const handleViewMore = () => {
    navigate(`/user/${id}`, { state: { user } }); // Pass the user data through state
  };

  const handleHallSelection = async (hall) => {
    setSelectedHall(hall);
    setIsDropdownOpen(false); // Close dropdown after selection
    onHallAllot(id, hall); // Call the callback to handle hall allotment

    try {
      const response = await fetch(`${BaseUrl}/api/user/allotHall`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id, // Replace with actual name if needed
          Hall: hall,
          token: localStorage.getItem('Admintoken')
        }),
      });
      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenerateCertificate = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(`${BaseUrl}/api/user/generateCertificate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id, // Replace with actual name if needed
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate certificate");
      }

      console.log("response got - ", response)
      // Convert response to a Blob for downloading
      const blob = await response.blob();
      console.log("blob - ", blob)
      // Create a blob link to download
      const url = window.URL.createObjectURL(blob);
      console.log("Url made - ", url)
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Certificate.pdf"); // Filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-xxl mx-auto mb-4">
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
        <p className="text-sm text-gray-600 truncate">
          <span className="font-semibold">Hall:</span> {selectedHall || user.Hall }
        </p>
        <p className="text-sm text-gray-600 truncate">
          <span className="font-semibold">State:</span> {user.state}
        </p>
      </div>
      <div className="flex flex-shrink-0 space-x-2 mt-2 sm:mt-0">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">
          Mark Present
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600" onClick={handleViewMore} >
          View More
        </button>

        <div className="relative" >
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
            onClick={toggleDropdown}
          >
            Allot Hall
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg" style={{zIndex:"10000"}}>
              <ul className="py-1">
                {Halls.map((hall) => (
                  <li
                    key={hall}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleHallSelection(hall)}
                  >
                    {hall}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600" onClick={handleGenerateCertificate} >
          Get Certificate
        </button>
        </div>
      </div>
    </div>
  );
};

export default UserBlock;
