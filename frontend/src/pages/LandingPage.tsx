import { useState,useEffect, useRef } from 'react'
import {BACKEND_URL,univerOptions} from "../../utils/backendUrl.js"
import { useSocket, useUser } from '../Providers/Socket.js';
import {useNavigate} from "react-router-dom"
import JoinRoom from './JoinRoom';


function LandingPage() {
    const user = useUser(); 
    const router  = useNavigate();
    const [name,setName]  = useState(user ? user?.user?.username : "");
    const roomId = user?.user?.roomId.length;
    console.log("RoomId",roomId)
    const [school,setSchool]  = useState("");
    const [choice,setChoice] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const socket = useSocket();
    const [localaudiotrack,setlocalaudiotrack] = useState<MediaStreamTrack|null>()
    const [localvideotrack,setlocalvideotrack] = useState<MediaStreamTrack|null>()
    const [joined,setJoined] = useState(false);
    const [open,setOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [roomIdConnect,setRoomIdConnect] = useState("");

  async function GetMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio:true,
      video:true
    })
    setlocalaudiotrack(stream.getAudioTracks()[0]);
    setlocalvideotrack(stream.getVideoTracks()[0]);
    if (videoRef.current) {
      videoRef.current.srcObject = stream; // Set the srcObject of the video element
    }
  }
  useEffect(()=>{
    if (videoRef && videoRef.current) {
      if(joined){
        GetMedia()
      }
  }
  },[joined])

    const handleJoinRoom = ()=>{
      if(selectedOption!="" && roomIdConnect==null){
        socket!.emit("joinRoom",{name,university:selectedOption});
      }
      else if(selectedOption!="" && roomIdConnect!==""){
        socket!.emit("joinRoom",{name,university:roomIdConnect});
      }
      else socket!.emit("joinRoom",{name});
     if(localaudiotrack && localvideotrack){
      // router(`/room`,{state:{name,localaudiotrack,localvideotrack}});
      setOpen(!open);
     }
    }

    if(open){
      return <JoinRoom name={name} localaudiotrack={localaudiotrack} localvideotrack={localvideotrack}/>
    }

  return (
    <div>
     <h1>Landing page</h1>
     <button onClick={()=>router("/home")}>Mentor-match</button>
     <p>Connect with anyone</p>
     <div>
      <p>Enter name</p>
      <input type="text" placeholder={name} onChange={(e)=>setName(e.target.value)}/>
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
      {!joined ? (<p onClick={()=>setJoined(!joined)}>start</p>):(<>
      <button onClick={handleJoinRoom}>Connect :))</button></>)}
      <br />
      <button onClick={()=>setChoice(!choice)}>{choice ? "Or enter selectively":"Change choice"}</button>
     </div>
     {roomId>0 ? (
      <input type="text" placeholder='Enter roomId' onChange={(e)=>setRoomIdConnect(e.target.value)}/>
     ):null}
     <p>{selectedOption}</p>
     <video ref={videoRef} autoPlay muted playsInline style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );

}

export default LandingPage;
