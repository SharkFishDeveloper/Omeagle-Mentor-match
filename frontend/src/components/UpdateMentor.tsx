import axios from 'axios';
import React, { useState } from 'react';
import { BACKEND_URL } from '../../utils/backendUrl';
import { useUser } from '../Providers/Socket';

const UpdateMentor = () => {
    const [price, setPrice] = useState<number>(0);
    const [username, setUsername] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [university, setUniversity] = useState('');
    const [specializations, setSpecializations] = useState<string[]|null>([]);
    const [timeslots, setTimeslots] = useState<number[]|null>([]);
    const { setUser } = useUser();

    const handleUpdate = async () => {
        try {
            const resp = await axios.put(`${BACKEND_URL}/app/mentor/update`, { price, username, imageUrl, university, specializations, timeslots }, { withCredentials: true });
            console.log(resp.data.message);
            setUser(resp.data.user);
            alert(resp.data.message);
        } catch (error) {
            console.log("error", error);
            alert("Couldn't update mentor !!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Update Mentor</h2>
                </div>
                <form className="mt-8 space-y-6">
                    <input
                        type="text"
                        
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter price"
                    />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
                        placeholder="Username"
                    />
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
                        placeholder="Image URL"
                    />
                    <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
                        placeholder="University"
                    />
                    <input
                        type="text"
                        onChange={(e) => setSpecializations(e.target.value.split(','))}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
                        placeholder="Specializations (comma separated)"
                    />
                    <input
                        type="text"
                        onChange={(e) => setTimeslots(e.target.value.split(',').map(Number))}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2"
                        placeholder="Timeslots (comma separated)"
                    />
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateMentor;
