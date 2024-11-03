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
  const [openTag, setOpenTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  const handleTagSelection = (e) => {
    const selectedTag = e.target.value;
    if (selectedTags?.includes(selectedTag)) {
      setSelectedTags(selectedTags.filter(tag => tag !== selectedTag));
    } else {
      setSelectedTags([...selectedTags, selectedTag]);
    }
  };

  const handleSearch = async () => {
    const resp = await axios.post(`${BACKEND_URL}/app/mentor/search`, {
      username, selectedTags, university
    }, { withCredentials: true });
    setMentors(resp.data.users);
  }

  const handleSingleMentorCard = (id: string) => {
    navigate(`/mentor/${id}`, { state: { id } });
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="flex items-center mb-4">
        <input type="text" placeholder='Enter mentor username' className="border border-gray-300 px-4 py-2 rounded-md mr-4" onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder='Enter university' className="border border-gray-300 px-4 py-2 rounded-md mr-4" onChange={(e) => setUniversity(e.target.value)} />
        <button onClick={() => setOpenTag(!openTag)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 focus:outline-none">{openTag ? "Close tags" : "Select tags"}</button>
        {openTag && (
          <select name="tags" multiple className="border border-gray-300 px-4 py-2 rounded-md mr-4" onChange={handleTagSelection}>
            {MentorTags.map(tag => (
              <option value={tag} key={tag} style={{ backgroundColor: selectedTags?.includes(tag) ? 'green' : 'white' }}>{tag}</option>
            ))}
          </select>
        )}
        <button onClick={handleSearch} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none">Search</button>
      </div>
      <div className="flex flex-wrap justify-center">
        {mentors && mentors.map(mentor => (
          <div key={mentor.id} className="mentor-card bg-white shadow-md rounded-lg m-4 cursor-pointer" onClick={() => handleSingleMentorCard(mentor.id)}>
            <img src={mentor.imageUrl} alt="Mentor" className="w-full h-64 object-cover rounded-t-lg" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{mentor.username}</h3>
              <p className="text-gray-600">University: {mentor.university}</p>
              <p className="text-gray-600">Specializations: {mentor.specializations.join(', ')}</p>
              <p className="text-gray-600">Rating: {mentor.rating}</p>
              <p className="text-gray-600">Price: ${mentor.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search;
