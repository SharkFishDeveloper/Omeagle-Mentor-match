import React, { useState } from "react";
import MentorTags from "../../utils/SearchMentorTags";
import axios from "axios";
import { BACKEND_URL } from "../../utils/backendUrl";
import { useNavigate } from "react-router-dom";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;

  user: {
    id: string;
    username: string;
    imageUrl?: string;
  };
}

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

  imageUrl: string;

  popularity: number;

  timeslots: string[];

  usersName: string[];

  roomId: string[];

  price: number;

  about: string;

  reviews: Review[];
}

const Search = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);


  const handleTagSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setSelectedTags(values);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const resp = await axios.post(
        `${BACKEND_URL}/app/mentor/search`,
        {
          username,
          selectedTags,
          university,
        },
        {
          withCredentials: true,
        }
      );

      setMentors(resp.data.users);
    } catch (error) {
      console.log("Error searching mentors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleMentorCard = (mentor: Mentor) => {
    navigate(`/mentor/${mentor.id}`, {
       state: {
        mentor,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">

      {/* SIDEBAR */}
      <div className="w-full lg:w-[320px] bg-white shadow-md p-5 lg:p-6">

        <h2 className="text-2xl lg:text-3xl font-bold mb-6">
          Filters
        </h2>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            Search by mentor name
          </label>

          <input
            type="text"
            placeholder="Search mentors..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* University */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            University
          </label>

          <input
            type="text"
            placeholder="Enter university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Specializations
          </label>

          <select
            multiple
            value={selectedTags}
            onChange={handleTagSelection}
            className="w-full border border-gray-300 rounded-lg p-3 h-40 lg:h-48 outline-none"
          >
            {MentorTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300"
        >
          {loading ? "Searching..." : "Apply Filters"}
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
          Find Mentors
        </h1>

        <p className="text-gray-600 text-base lg:text-lg mb-8">
          Discover and connect with the right mentor.
        </p>

        {/* EMPTY */}
        {!loading && mentors.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            No mentors found
          </div>
        )}

        {/* LIST */}
        <div className="space-y-5">

          {mentors.map((mentor) => (

            <div
              key={mentor.id}
              onClick={() => handleSingleMentorCard(mentor)}
              className="
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition
                duration-300
                p-5
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-5
                cursor-pointer
              "
            >

              {/* LEFT SIDE */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">

                <img
                  src={
                    mentor.imageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="mentor"
                  className="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    border
                  "
                />

                <div className="text-center sm:text-left flex-1">

                  <h2 className="text-xl sm:text-2xl font-bold">
                    {mentor.username}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {mentor.about ? mentor.about : "No about section"}
                  </p>

                  <p className="text-gray-600 mt-1">
                    {mentor.university}
                  </p>

                  <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    {mentor.specializations.join(", ")}
                  </p>

                  <div className="
                    flex
                    flex-wrap
                    justify-center
                    sm:justify-start
                    gap-4
                    mt-4
                    text-sm
                  ">

                    <span className="font-medium">
                      ⭐ {mentor.rating}
                    </span>

                    <span className="font-medium">
                      👥 {mentor.userMentored} sessions
                    </span>

                    <span className="text-green-600 font-semibold">
                      Available
                    </span>

                    <span className="font-semibold text-blue-600">
                      ${mentor.price}
                    </span>

                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button
                className="
                  w-full
                  lg:w-auto
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  transition
                  duration-300
                "
              >
                View Profile
              </button>

            </div>

          ))}

        </div>
      </div>
    </div>
  );
};

export default Search;