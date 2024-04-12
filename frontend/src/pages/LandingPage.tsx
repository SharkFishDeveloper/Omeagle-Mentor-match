import { useState,useEffect } from 'react'
import {BACKEND_URL,univerOptions} from "../../utils/backendUrl.js"
import { useSocket } from '../Providers/Socket.js';
import {useNavigate} from "react-router-dom"


function LandingPage() {
    const router  = useNavigate();
    const [name,setName]  = useState("");
    const [school,setSchool]  = useState("");
    const [choice,setChoice] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const socket = useSocket();
    
    const handleJoinRoom = ()=>{
      if(selectedOption!=""){
        socket!.emit("clientMessage",{name,school:selectedOption});
      }
      else socket!.emit("joinRoom",{name});
    }

    useEffect(()=>{
      socket?.on("connected-to-room",({id}):void=>{
        alert(`Connect with id - ${id}`);
        router(`/room/${id}`,{state:{name}});
      });
      
      return () => {
        socket?.off();
      };
    },[socket,name])


  return (
    <div>
     <h1>Landing page</h1>
     <p>Connect with anyone</p>
     <div>
      <p>Enter name</p>
      <input type="text" placeholder='Your name' onChange={(e)=>setName(e.target.value)}/>
      { !choice && (
        <div>
          <p>Enter choice</p>
        {univerOptions.map((options,index)=>(
          <div key={index} onClick={()=>setSelectedOption(options)}>{options}</div>
        ))}
        </div>
      )}
      {!choice && (
        <button onClick={()=>setSelectedOption("")}>Clear option </button>
      )}
      <button onClick={handleJoinRoom}>Connect :))</button>
      <br />
      <button onClick={()=>setChoice(!choice)}>{choice ? "Or enter selectively":"Change choice"}</button>
     </div>
     <p>{selectedOption}</p>
    </div>
  );
}

export default LandingPage;
