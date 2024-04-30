import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Welcome to Our Mentorship Platform!</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-4 text-blue-600">Discover and Grow with Us</h2>
          <p className="text-lg mb-6">Connect with mentors worldwide, gain valuable insights, and achieve your goals.</p>

          <ul className="list-disc ml-6 mb-6">
            <li className="text-lg mb-2">Engage in video calls with mentors after payment</li>
            <li className="text-lg mb-2">Find mentors from your university or anywhere in the world</li>
            <li className="text-lg mb-2">Enjoy spontaneous video calls with random connections</li>
            <li className="text-lg mb-2">Enhance communication with in-call chat feature</li>
            <li className="text-lg mb-2">Effortlessly search for mentors using advanced filters</li>
          </ul>

          <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 inline-block">Get Started</Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold mb-4 text-blue-600">Why Choose Us?</h2>
          <p className="text-lg mb-6">Our platform is designed to empower both mentors and learners, fostering meaningful connections and facilitating knowledge exchange.</p>

          <p className="text-lg mb-6">Join us today and embark on a journey of growth and learning!</p>

          <div className="flex justify-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEt48cM8EXhNxlcc2Mu184-CJorKv6yV08A3d4tAaVbQ&s" alt="Mentorship" className="w-64" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
