import React, { useState } from 'react';
import MentorTags from "../../utils/SearchMentorTags";
import axios from 'axios';
import { BACKEND_URL } from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';

export interface Mentor {
  id: string;
  email: string;
  password: string;
  username: string;
  university: string;
  specializations: string[];
  rating: number;
  userMentored: number;
  mentoredId: string[];
  comments: string[];
  imageUrl: string;
  popularity: number;
  timeslots: string[];
  usersName: string[];
  roomId: string[];
  price: number;
}

const Search = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTagSelection = (tag: string) => {
    setSelectedTags(prevSelectedTags => 
      prevSelectedTags.includes(tag) ? prevSelectedTags.filter(t => t !== tag) : [...prevSelectedTags, tag]
    );
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const resp = await axios.post(`${BACKEND_URL}/app/mentor/search`, {
        username, selectedTags, university
      }, { withCredentials: true });
      setMentors(resp.data.users);
    } catch (error) {
      console.error("Error fetching mentors", error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleSingleMentorCard = (id: string) => {
    navigate(`/mentor/${id}`, { state: { id } });
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8 px-4">
      <div className="flex flex-col md:flex-row items-center mb-4 w-full max-w-3xl">
        <input
          type="text"
          placeholder='Enter mentor username'
          className="border border-gray-300 px-4 py-2 rounded-md mr-2 w-full md:w-1/3 mb-2 md:mb-0"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder='Enter university'
          className="border border-gray-300 px-4 py-2 rounded-md mr-2 w-full md:w-1/3 mb-2 md:mb-0"
          onChange={(e) => setUniversity(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none w-full md:w-auto"
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap mb-4">
        {MentorTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagSelection(tag)}
            className={`m-1 px-4 py-2 rounded-md transition-colors duration-300 ${selectedTags.includes(tag) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center w-full max-w-6xl">
      {loading ? (
                    <p>Loading mentors...</p> // Show loading message while fetching
                ) : (
                    mentors.length > 0 ? mentors.map(mentor => (
                        <div
                            key={mentor.id}
                            className="mentor-card bg-white shadow-md rounded-lg m-4 cursor-pointer transform transition-transform duration-200 hover:scale-105"
                            onClick={() => handleSingleMentorCard(mentor.id)}
                        >
                            <img
                                src={mentor.imageUrl}
                                alt="Mentor"
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{mentor.username}</h3>
                                <p className="text-gray-600">University: {mentor.university}</p>
                                <p className="text-gray-600">Specializations: {mentor.specializations.join(', ')}</p>
                                <p className="text-gray-600">Rating: {mentor.rating}</p>
                                <p className="text-gray-600">Price: ${mentor.price}</p>
                            </div>
                        </div>
                    )) : (
                        <p>No mentor found</p>
                    )
                )}
      </div>
    </div>
  );
}

export default Search;
