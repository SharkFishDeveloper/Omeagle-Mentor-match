import axios from 'axios';
import React, { useState } from 'react'
import { BACKEND_URL } from '../../utils/backendUrl';
import { useUser } from '../Providers/Socket';

const UpdateMentor = () => {
    const [price, setPrice] = useState<number>(0);
    const [username, setUsername] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [university, setUniversity] = useState('');
    const [specializations, setSpecializations] = useState<string[]|null>([]);
    const [timeslots, setTimeslots] = useState<number[]|null>([]);
    const {setUser} = useUser();

    console.log(specializations);
    console.log(typeof timeslots,timeslots);
    const handleUpdate =async () => {
     try {
        const resp = await axios.put(`${BACKEND_URL}/app/mentor/update`,{price,username,imageUrl,university,specializations,timeslots},{withCredentials:true});
        console.log(resp.data.message);
        setUser(resp.data.user);
        alert(resp.data.message);

     } catch (error) {
        console.log("error",error);
        alert("Couldn't update mentor !!");
     }

    };

    return (
        <div>
            <input
                type="text"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Price"
            />
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
            />
            <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="University"
            />
            <input
                type="text"
                onChange={(e) =>  setSpecializations(e.target.value.split(','))}
                placeholder="Specializations"
            />
            <input
                type="text"
                onChange={(e) => 
                     setTimeslots(e.target.value.split(',').map(Number))}
                placeholder="Timeslots"
            />
            <button onClick={handleUpdate}>Update</button>
        </div>)
        
}

export default UpdateMentor