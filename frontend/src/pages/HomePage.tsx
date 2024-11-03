import { useState } from 'react';
import { useUser } from '../Providers/Socket';
import { FaUserCircle } from "react-icons/fa"; // Changed to FaUserCircle for better user icon
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
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-2xl">{user ? (userlength ? "Hey, Mentor" : "Hello, User") : 'Loading...'}</p>
      {userlength && (
        <FaUserCircle className="text-6xl mt-4 cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-300" onClick={() => navigate("/update-mentor")} />
      )}
      {!userlength ? (
        <>
          {user && (
            <button onClick={() => setHistory(!history)} className="text-black font-bold text-xl mt-4 focus:outline-none underline">
              {history ? "Close" : "See Room IDs for connecting with mentors"}
            </button>
          )}
          {user && history && (
            <div className="flex mt-4">
              <div className="mr-8">
                <h2 className="text-lg font-bold mb-2">Mentor Names:</h2>
                <ul>
                  {user.user?.mentorName ? (
                    user.user.mentorName.map((name, index) => (
                      <li key={index} className="list-disc ml-4">{name}</li>
                    ))
                  ) : (
                    <li className="list-disc ml-4">Nothing</li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2">Room IDs:</h2>
                <ul>
                  {user.user?.roomId ? (
                    user.user.roomId.map((roomId, index) => (
                      <li key={index} className="list-disc ml-4">{roomId}</li>
                    ))
                  ) : (
                    <li className="list-disc ml-4">Nothing</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <button onClick={() => setmentorHistory(!mentorHistory)} className="text-black font-bold text-xl mt-4 focus:outline-none underline">
            {mentorHistory ? "Close" : "See Room IDs for connecting with users"}
          </button>
          {user && mentorHistory && (
            <div className="flex mt-4">
              <div className="mr-8">
                <h2 className="text-lg font-bold mb-2">User Names:</h2>
                <ul>
                  {user.user?.usersName ? (
                    user.user.usersName.map((name, index) => (
                      <li key={index} className="list-disc ml-4">{name}</li>
                    ))
                  ) : (
                    <li className="list-disc ml-4">Nothing</li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2">Room IDs:</h2>
                <ul>
                  {user.user?.roomId ? (
                    user.user.roomId.map((roomId, index) => (
                      <li key={index} className="list-disc ml-4">{roomId}</li>
                    ))
                  ) : (
                    <li className="list-disc ml-4">Nothing</li>
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
