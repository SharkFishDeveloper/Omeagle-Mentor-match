import React, { useEffect, useState } from 'react';
import { Mentor, useUser } from '../Providers/Socket';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/backendUrl';

const MentorCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state.id;
    const [mentor, setMentor] = useState<Mentor | null>();
    const [money, setMoney] = useState<number>();
    const { user, setUser } = useUser();
    const username = user ? user.username : null;
    const option = { username, money };

    const handleConnect = async () => {
        if (!money || isNaN(money) || mentor?.price !== money) {
            return alert("Please enter a valid amount.");
        }
        
        try {
            const resp = await axios.put(`${BACKEND_URL}/app/user/connect-with-mentor/id=${id}`, option, { withCredentials: true });
            console.log(resp.data.message);
            console.log(resp.data.user);
            setUser(resp.data.user);
            alert(`Success! Connected with mentor. Room ID: ${resp.data.roomId}`);
            navigate('/');
        } catch (error) {
            console.error("Error connecting with mentor:", error.message);
            alert("Error connecting with mentor.");
        }
    };

    useEffect(() => {
        const findMentor = async () => {
            try {
                const resp = await axios.get(`${BACKEND_URL}/app/mentor/id=${id}`, { withCredentials: true });
                console.log("resp", resp.data.message);
                setMentor(resp.data.message);
            } catch (error) {
                console.error("Error finding mentor:", error.message);
                alert("Error finding mentor.");
            }
        };
        findMentor();
    }, [id]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Connect with Mentor</h2>
                {mentor && (
                    <div className="mb-4">
                        <p className="font-semibold">Mentor Details:</p>
                        <p>Name: {mentor.username}</p>
                        <p>University: {mentor.university}</p>
                        <p>Specializations: {mentor.specializations.join(', ')}</p>
                        <p>Price: ${mentor.price}</p>
                    </div>
                )}
                <input
                    type="number"
                    value={money || ''}
                    onChange={(e) => setMoney(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
                />
                <button
                    onClick={handleConnect}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Connect
                </button>
            </div>
        </div>
    );
};

export default MentorCard;
