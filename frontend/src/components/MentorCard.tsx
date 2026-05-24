import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Providers/Socket";
import axios from "axios";
import { BACKEND_URL } from "../../utils/backendUrl";


interface ReviewUser {
  id: string;
  username: string;
  imageUrl?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;

  user: ReviewUser;
}


const MentorCard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mentor = location.state.mentor;

  const [money, setMoney] = useState<number>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<number>(23);

  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(5);

  const [reviews, setReviews] = useState<Review[]>(
  mentor.reviews || []
);

  const { user, setUser } = useUser();

  const username = user ? user.username : null;

  // const option = {
  //   username,
  //   money,
  // };
  const option = {
  selectedTime,
  selectedDate,
  money,
}

  const fakeTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];

  const fakeDates = [
    1,2,3,4,5,6,7,
    8,9,10,11,12,13,14,
    15,16,17,18,19,20,21,
    22,23,24,25,26,27,28,
  ];

  // const handleConnect = async () => {
  //   if (!money || isNaN(money) || mentor.price !== money) {
  //     return alert("Please enter correct amount");
  //   }

  //   if (!selectedTime) {
  //     return alert("Please select a time slot");
  //   }

  //   try {

  //     const resp = await axios.put(
  //       `${BACKEND_URL}/app/user/connect-with-mentor/id=${mentor.id}`,
  //       option,
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     setUser(resp.data.user);

  //     alert(
  //       `Session booked with ${mentor.username}`
  //     );

  //     navigate("/");

  //   } catch (error: any) {

  //     console.log(error.message);

  //     alert("Error connecting with mentor");
  //   }
  // };

  const handleConnect = async () => {

  if (!money || isNaN(money) || mentor.price !== money) {
    return alert("Please enter correct amount");
  }

  if (!selectedTime) {
    return alert("Please select a time slot");
  }

  try {

    const resp = await axios.post(
      `${BACKEND_URL}/app/user/book-session/${mentor.id}`,
      option,
      {
        withCredentials: true,
      }
    );

    alert(
      `Meeting booked successfully on May ${selectedDate} at ${selectedTime}`
    );

    navigate("/");

  } catch (error: any) {

    console.log(error.message);

    alert("Error booking session");
  }
};

  const handleAddReview = async () => {
  try {

    if (!reviewComment.trim()) {
      return alert("Please write a review");
    }

    const resp = await axios.post(
      `${BACKEND_URL}/app/mentor/review/${mentor.id}`,
      {
        rating: reviewRating,
        comment: reviewComment,
      },
      {
        withCredentials: true,
      }
    );

    const newReview: Review = resp.data.review;

    // remove old review from same user if exists
    const filteredReviews = reviews.filter(
      (review) => review.user.id !== newReview.user.id
    );

    setReviews([
      newReview,
      ...filteredReviews,
    ]);

    setReviewComment("");
    setReviewRating(5);

    alert("Review added successfully");

  } catch (error: any) {

    console.log(error.message);

    alert("Failed to add review");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-5 lg:p-10">

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT */}
          <div className="p-5 sm:p-6 lg:p-10 border-b lg:border-b-0 lg:border-r">

            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 font-medium mb-8"
            >
              ← Back
            </button>

            {/* PROFILE */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              <img
                src={
                  mentor.imageUrl ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="mentor"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border"
              />

              <div className="text-center sm:text-left">

                <h1 className="text-2xl sm:text-3xl font-bold">
                  {mentor.username}
                </h1>

                <p className="text-gray-600 mt-2">
                  {mentor.university}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">

                  {mentor.specializations.map(
                    (spec: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
                      >
                        {spec}
                      </span>
                    )
                  )}

                </div>

                <div className="flex flex-wrap gap-4 mt-5 justify-center sm:justify-start text-sm">

                  <span>
                    ⭐ {mentor.rating}
                  </span>

                  <span>
                    👥 {mentor.userMentored} sessions
                  </span>

                  <span className="text-green-600 font-semibold">
                    Available
                  </span>

                </div>
              </div>
            </div>

            {/* ABOUT */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-4">
                About
              </h2>

              <p className="text-gray-600 leading-7">
                {mentor.about}
              </p>

            </div>

            {/* REVIEWS */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">
                Reviews
              </h2>

              {/* ADD REVIEW */}
              <div className="border rounded-2xl p-5 mb-8 bg-gray-50">

                <h3 className="font-semibold text-lg mb-4">
                  Add Review
                </h3>

                {/* STARS */}
                <div className="flex gap-2 mb-4">

                  {[1,2,3,4,5].map((star) => (

                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl ${
                        reviewRating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>

                  ))}

                </div>

                {/* COMMENT */}
                <textarea
                  value={reviewComment}
                  onChange={(e) =>
                    setReviewComment(e.target.value)
                  }
                  placeholder="Write your review..."
                  className="
                    w-full
                    border
                    rounded-xl
                    p-4
                    outline-none
                    resize-none
                    h-32
                    focus:border-blue-500
                  "
                />

                <button
                  onClick={handleAddReview}
                  className="
                    mt-4
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  Submit Review
                </button>

              </div>

              {/* REVIEW LIST */}
              {reviews.length > 0 ? (

                <div className="space-y-4">

                  {reviews.map((review: any) => (

                    <div
                      key={review.id}
                      className="border rounded-xl p-5 bg-gray-50"
                    >

                      <div className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                      ">

                        <div className="flex items-center gap-3">

                          <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-blue-600
                            text-white
                            flex
                            items-center
                            justify-center
                            font-bold
                          ">
                            {review.user?.username?.[0] || "U"}
                          </div>

                          <div>

                            <p className="font-semibold">
                              {review.user?.username || "Anonymous"}
                            </p>

                            <p className="text-sm text-gray-500">
  {new Date(review.createdAt).toLocaleDateString()}
</p>

                          </div>
                        </div>

                        <div className="font-semibold">
                          ⭐ {review.rating}
                        </div>

                      </div>

                      <p className="text-gray-600 mt-4 leading-7">
                        {review.comment}
                      </p>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="text-gray-500">
                  No reviews yet
                </div>

              )}
            </div>

          </div>

          {/* RIGHT */}
          <div className="p-5 sm:p-6 lg:p-10">

            <h1 className="text-2xl sm:text-3xl font-bold mb-8">
              Book a Session
            </h1>

            {/* CALENDAR */}
            <div className="border rounded-2xl p-4 sm:p-6">

              <div className="flex justify-between items-center mb-6">

                <button className="text-xl font-bold">
                  ←
                </button>

                <h2 className="text-lg sm:text-xl font-semibold">
                  May 2026
                </h2>

                <button className="text-xl font-bold">
                  →
                </button>

              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-3">

                {fakeDates.map((date) => (

                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      h-10
                      rounded-lg
                      text-sm
                      transition
                      ${
                        selectedDate === date
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    {date}
                  </button>

                ))}

              </div>
            </div>

            {/* TIMES */}
            <div className="mt-8">

              <h2 className="text-2xl font-bold mb-5">
                Select Time Slot
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                {fakeTimes.map((time) => (

                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      border
                      rounded-lg
                      py-3
                      text-sm
                      transition
                      ${
                        selectedTime === time
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    {time}
                  </button>

                ))}

              </div>
            </div>

            {/* PAYMENT */}
            <div className="mt-8">

              <h2 className="text-2xl font-bold mb-5">
                Payment
              </h2>

              <input
                type="number"
                value={money || ""}
                onChange={(e) =>
                  setMoney(Number(e.target.value))
                }
                placeholder={`Enter $${mentor.price}`}
                className="
                  w-full
                  border
                  rounded-lg
                  p-4
                  outline-none
                  focus:border-blue-500
                "
              />

            </div>

            {/* TOTAL */}
            <div className="mt-6 bg-gray-50 rounded-xl p-5">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Session Fee
                </span>

                <span className="font-semibold">
                  ${mentor.price}
                </span>

              </div>

              <div className="flex justify-between mt-3">

                <span className="text-gray-600">
                  Selected Time
                </span>

                <span className="font-semibold">
                  {selectedTime || "Not selected"}
                </span>

              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={handleConnect}
              className="
                w-full
                mt-8
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-4
                rounded-xl
                text-lg
                font-semibold
                transition
              "
            >
              Proceed to Payment
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;