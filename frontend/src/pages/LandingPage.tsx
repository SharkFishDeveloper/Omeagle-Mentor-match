import { useState,useEffect, useRef } from 'react'
import {BACKEND_URL,univerOptions} from "../../utils/backendUrl.js"
import { useSocket } from '../Providers/Socket.js';
import {useNavigate} from "react-router-dom"
import JoinRoom from './JoinRoom';


function LandingPage() {
    const router  = useNavigate();
    const [name,setName]  = useState("");
    const [school,setSchool]  = useState("");
    const [choice,setChoice] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const socket = useSocket();
    const [localaudiotrack,setlocalaudiotrack] = useState<MediaStreamTrack|null>()
    const [localvideotrack,setlocalvideotrack] = useState<MediaStreamTrack|null>()
    const [joined,setJoined] = useState(false);
    const [open,setOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

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
      if(selectedOption!=""){
        socket!.emit("joinRoom",{name,university:selectedOption});
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
      {!joined ? (<p onClick={()=>setJoined(!joined)}>start</p>):(<>
      <button onClick={handleJoinRoom}>Connect :))</button></>)}
      <br />
      <button onClick={()=>setChoice(!choice)}>{choice ? "Or enter selectively":"Change choice"}</button>
     </div>
     <p>{selectedOption}</p>
     <video ref={videoRef} autoPlay muted playsInline style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );

}

export default LandingPage;
