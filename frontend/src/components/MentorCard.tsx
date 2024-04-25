import React, { useEffect, useState } from 'react'
import { Mentor, useUser } from '../Providers/Socket'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BACKEND_URL } from '../../utils/backendUrl';

const MentorCard = () => {
    const location = useLocation();
    const navigate= useNavigate();
    const id = location.state.id;
    const [mentor,setMentor] = useState<Mentor|null>();
    const [money,setmoney] = useState<number>();
    const {user,setUser} = useUser();
    const username = user ? user.username : null;
    const option = {username,money};
    const handleConnect =async ()=>{
        if(mentor?.price !== money){
            return alert("Enter appropriate amount ")
        }
        const resp = await axios.put(`${BACKEND_URL}/app/user/connect-with-mentor/id=${id}`,option,{withCredentials:true});
        console.log(resp.data.message);
        console.log(resp.data.user);
       
        setUser(resp.data.user);
        alert(`Message:Sucess, connect with roomId - ${resp.data.roomId}`)
        navigate('/');
    }

    useEffect(()=>{
        const findMentor =async ()=>{
           try {
            const resp = await axios.get(`${BACKEND_URL}/app/mentor/id=${id}`,{withCredentials:true});
            console.log("resp",resp.data.message);
            setMentor(resp.data.message)
           } catch (error) {
            alert("Error in connecting with mentor")
  
           }
        }
        findMentor();
    },[id])
  return (
    <div>
        MentorCard
        <p>{mentor && JSON.stringify(mentor)}</p>
        <input type="text" onChange={(e)=>setmoney(Number(e.target.value))} placeholder='Enter amount'/>
        <button onClick={handleConnect}>Connect </button>
    </div>
  )
}

export default MentorCard