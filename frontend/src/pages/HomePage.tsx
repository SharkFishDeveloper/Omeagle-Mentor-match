import { useState } from 'react';
import { useUser } from '../Providers/Socket';
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const user = useUser();
  const navigate = useNavigate();
  let userlength = false;
  if (user?.user?.timeslots) {
    userlength = true;
  }
  const [history, setHistory] = useState(false);
  const [mentorHistory, setmentorHistory] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <p className="text-3xl font-semibold text-gray-800 mb-6">
        {user ? (userlength ? "Hey, Mentor" : "Hello, User") : 'Loading...'}
      </p>

      {userlength && (
        <FaUserCircle 
          className="text-7xl mb-4 cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-300"
          onClick={() => navigate("/update-mentor")} 
        />
      )}

      {!userlength ? (
        <>
          {user && (
            <button 
              onClick={() => setHistory(!history)} 
              className="text-xl font-bold mt-4 focus:outline-none text-blue-600 hover:underline"
            >
              {history ? "Close" : "See Room IDs for connecting with mentors"}
            </button>
          )}
          {user && history && (
            <div className="flex mt-4 bg-white shadow-md rounded-lg p-6 space-x-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Mentor Names:</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {user.user?.mentorName ? (
                    user.user.mentorName.map((name, index) => (
                      <li key={index} className="ml-4">{name}</li>
                    ))
                  ) : (
                    <li className="ml-4">Nothing</li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Room IDs:</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {user.user?.roomId ? (
                    user.user.roomId.map((roomId, index) => (
                      <li key={index} className="ml-4">{roomId}</li>
                    ))
                  ) : (
                    <li className="ml-4">Nothing</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <button 
            onClick={() => setmentorHistory(!mentorHistory)} 
            className="text-xl font-bold mt-4 focus:outline-none text-blue-600 hover:underline"
          >
            {mentorHistory ? "Close" : "See Room IDs for connecting with users"}
          </button>
          {user && mentorHistory && (
            <div className="flex mt-4 bg-white shadow-md rounded-lg p-6 space-x-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">User Names:</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {user.user?.usersName ? (
                    user.user.usersName.map((name, index) => (
                      <li key={index} className="ml-4">{name}</li>
                    ))
                  ) : (
                    <li className="ml-4">Nothing</li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Room IDs:</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {user.user?.roomId ? (
                    user.user.roomId.map((roomId, index) => (
                      <li key={index} className="ml-4">{roomId}</li>
                    ))
                  ) : (
                    <li className="ml-4">Nothing</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
