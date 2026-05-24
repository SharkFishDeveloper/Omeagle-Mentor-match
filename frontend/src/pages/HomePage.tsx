import { useEffect, useState } from "react";
import { useUser } from "../Providers/Socket";
import {
  FaUserCircle,
  FaVideo,
  FaClock,
  FaHistory,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../utils/backendUrl";

interface Meeting {
  id: string;
  roomId: string;

  mentorName: string;
  userName: string;

  scheduledAt: string;

  status: string;
}

const HomePage = () => {
  const user = useUser();

  const navigate = useNavigate();

  const isMentor = !!user?.user?.timeslots;

  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchMeetings = async () => {
  try {

    const endpoint = isMentor
      ? "/app/mentor/meetings"
      : "/app/user/meetings";

    const resp = await axios.get(
      `${BACKEND_URL}${endpoint}`,
      {
        withCredentials: true,
      }
    );

    setMeetings(resp.data.meetings);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);
  }
};

    fetchMeetings();

  }, []);

  const upcomingMeetings = meetings.filter(
    (meeting) => meeting.status === "upcoming"
  );

  const previousMeetings = meetings.filter(
    (meeting) => meeting.status === "completed"
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">

      {/* TOP */}
      <div className="max-w-7xl mx-auto">

        <div className="
          bg-white
          rounded-3xl
          shadow-md
          p-6
          sm:p-8
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
        ">

          {/* LEFT */}
          <div className="flex items-center gap-5">

            <FaUserCircle className="text-6xl text-blue-600" />

            <div>

              <h1 className="text-3xl sm:text-4xl font-bold">

                {isMentor
                  ? `Welcome back Mentor`
                  : `Welcome back ${user?.user?.username}`}

              </h1>

              <p className="text-gray-500 mt-2">

                {isMentor
                  ? "Manage your mentorship sessions"
                  : "Track your mentorship journey"}

              </p>

            </div>
          </div>

          {/* RIGHT */}
          {isMentor && (

            <button
              onClick={() => navigate("/update-mentor")}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-4
                rounded-2xl
                font-semibold
                transition
              "
            >
              Update Mentor Profile
            </button>

          )}

        </div>

        {/* STATS */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
          mt-8
        ">

          <div className="bg-white rounded-2xl p-6 shadow-md">

            <FaVideo className="text-3xl text-blue-600 mb-4" />

            <h2 className="text-2xl font-bold">
              {upcomingMeetings.length}
            </h2>

            <p className="text-gray-500 mt-1">
              Upcoming Meetings
            </p>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">

            <FaHistory className="text-3xl text-green-600 mb-4" />

            <h2 className="text-2xl font-bold">
              {previousMeetings.length}
            </h2>

            <p className="text-gray-500 mt-1">
              Previous Meetings
            </p>

          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">

            <FaClock className="text-3xl text-orange-500 mb-4" />

            <h2 className="text-2xl font-bold">
              {meetings.length}
            </h2>

            <p className="text-gray-500 mt-1">
              Total Sessions
            </p>

          </div>

        </div>

        {/* UPCOMING */}
        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Upcoming Meetings
          </h2>

          <div className="space-y-5">

            {upcomingMeetings.length > 0 ? (

              upcomingMeetings.map((meeting) => (

                <div
                  key={meeting.id}
                  className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-6
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                  "
                >

                  <div>

                    <h3 className="text-2xl font-bold">

                      {isMentor
                        ? meeting.userName
                        : meeting.mentorName}

                    </h3>

                    <p className="text-gray-500 mt-2">
                      Room ID: {meeting.roomId}
                    </p>

                    <p className="text-gray-500 mt-1">
                      {new Date(
                        meeting.scheduledAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <button
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-6
                      py-3
                      rounded-xl
                    "
                  >
                    Join Meeting
                  </button>

                </div>

              ))

            ) : (

              <div className="
                bg-white
                rounded-2xl
                shadow-md
                p-10
                text-center
                text-gray-500
              ">
                No upcoming meetings
              </div>

            )}

          </div>
        </div>

        {/* PREVIOUS */}
        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">
            Previous Meetings
          </h2>

          <div className="space-y-5">

            {previousMeetings.length > 0 ? (

              previousMeetings.map((meeting) => (

                <div
                  key={meeting.id}
                  className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-6
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                  "
                >

                  <div>

                    <h3 className="text-2xl font-bold">

                      {isMentor
                        ? meeting.userName
                        : meeting.mentorName}

                    </h3>

                    <p className="text-gray-500 mt-2">
                      Room ID: {meeting.roomId}
                    </p>

                    <p className="text-gray-500 mt-1">
                      {new Date(
                        meeting.scheduledAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <span className="
                    bg-gray-100
                    text-gray-700
                    px-5
                    py-3
                    rounded-xl
                    font-medium
                  ">
                    Completed
                  </span>

                </div>

              ))

            ) : (

              <div className="
                bg-white
                rounded-2xl
                shadow-md
                p-10
                text-center
                text-gray-500
              ">
                No previous meetings
              </div>

            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;