import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useSocket } from '../Providers/Socket';

const server = new RTCPeerConnection({iceServers:[{
    urls:[
        "stun:stun.l.google.com:19302"
    ]
}]});

const JoinRoom = () => {
   const {id:roomId} =  useParams();
   console.log("Room id is - ",roomId,typeof roomId)
   const location  = useLocation();
   const socket = useSocket(); 
   let SDP='';
   const [isConnected,setisConnected] = useState(false);
   const [stream,setStream] = useState<MediaStream|null>();
   const videoRef = useRef<HTMLVideoElement>(null);
   const [remoteStream,setRemoteStream] = useState(null);
   const remoteVideoRef = useRef<HTMLVideoElement>(null);

   const createOffer =useCallback(
    async ()=>{
        console.log(server);
        const sdp = await server.createOffer();
        await server.setLocalDescription(sdp);
        socket?.emit("offer",{sdp,roomId});
        console.log(sdp);
        },[socket]
   )

   const createAns = useCallback(async(sdp:any)=>{
    server.setRemoteDescription(sdp);
    const answer =await server.createAnswer();
    await server.setRemoteDescription(sdp);
    await server.setLocalDescription(answer);
    console.log("ans sdp = ",answer);
    socket?.emit("answer",{sdp:answer,roomId});
    setisConnected(!isConnected);
   },[socket]);

   
  const getUserMedia = useCallback(async()=>{
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setStream(stream);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
  },[])



   useEffect(()=>{
    socket?.on("offer",({sdp})=>{
        // const sessionDescription = new RTCSessionDescription(sdp);
        console.log("Type of sdp ",sdp)
        server.setRemoteDescription(sdp);
        alert(`Someone wants to connect with you - remote SDP - ${sdp}`);
 
        console.log(`sdp -> ${JSON.stringify(sdp)}`);
    })
    socket?.on("call-accepted",({sdp})=>{
        console.log("Accepting call - ",sdp);
        console.log(` The user accepted call - remote SDP - ${sdp}`)
        SDP = sdp;
        setisConnected(!isConnected);
        alert(`Call accepted from user - ${sdp}`);
    })

    return ()=>{
        socket?.off();
    }
   },[]);


   useEffect(()=>{
    getUserMedia();
   },[])

   const handleReciveStream = useCallback((ev:RTCTrackEvent)=>{
    const stream = ev.streams[0];
    console.log('Received stream:', stream);
    setRemoteStream(stream);
    if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
    }
   },[])


   const sendStream = ()=>{
    const track = stream?.getTracks();
    track?.forEach(track=>{
        server.addTrack(track);
    })
   }



   useEffect(()=>{
    server.addEventListener('track',handleReciveStream)

    return () => {
        server.removeEventListener('track', handleReciveStream);
    };
},[handleReciveStream])







  return (
    <div><p>JOin room</p>
    <p>Room id - {roomId}</p>
    <p>{name} - You are connected in a room with someone</p>
    {!isConnected && (
        <button onClick={createOffer}>Ask to connect</button>
    )}
    <br />
    {!isConnected && (
        <button onClick={()=>createAns(SDP)}>Accept call </button>
    )}
    <video ref={videoRef}  width={400} height={400} autoPlay={true}></video>
    <video ref={remoteVideoRef}  width={400} height={400} autoPlay={true}></video>
    </div>
  )
}

export default JoinRoom