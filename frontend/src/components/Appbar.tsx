import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Providers/Socket';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/backendUrl';

const Appbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const resp = await axios.get(`${BACKEND_URL}/app/user/signout`, { withCredentials: true });
      console.log("Logged out:", resp.data);
      setUser(null);
      setIsOpen(false);  // Close drawer after logout
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
        </Link>
        
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:w-auto">
          <ul className="flex space-x-8 font-medium">
            <li>
              <Link to="/" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">About</Link>
            </li>
            <li>
              {!user ? (
                <Link to="/login" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">Login</Link>
              ) : (
                <p className="text-gray-900 cursor-pointer hover:text-blue-700 dark:text-white dark:hover:text-blue-500" onClick={handleLogout}>Logout</p>
              )}
            </li>
            <li>
              <Link to="/connect" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">Connect</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-gray-50 dark:bg-gray-800 shadow-md flex justify-center">
          <ul className="flex flex-row items-center space-x-4 py-4 md:hidden ">
            <li>
              <Link to="/" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" >Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" >About</Link>
            </li>
            <li>
              {!user ? (
                <Link to="/login" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" >Login</Link>
              ) : (
                <p className="text-gray-900 cursor-pointer hover:text-blue-700 dark:text-white dark:hover:text-blue-500" >Logout</p>
              )}
            </li>
            <li>
              <Link to="/connect" className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" >Connect</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Appbar;
