import  { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {  useLocation, useParams } from 'react-router-dom'
import { useSocket } from '../Providers/Socket';


const JoinRoom = () => {
    const {id:roomId} = useParams();
    const {state} = useLocation();
    console.log(state);
    const {name} = state;
    const socket = useSocket();
    const [localaudiotrack,setLocalaudiotrack] = useState<MediaStreamTrack|null>();
    const [localvideotrack,setLocalvideotrack] = useState<MediaStreamTrack|null>();
    const [remoteaudiotrack,setRemoteaudiotrack] = useState<MediaStreamTrack|null>();
    const [remotevideotrack,setRemotevideotrack] = useState<MediaStreamTrack|null>();
    const videoRef = useRef<HTMLVideoElement>();
    const pc = useMemo(() => new RTCPeerConnection({iceServers:[{
        urls:[
            "stun:stun.l.google.com:19302"
        ]
    }]}), []);
    // const pc = new RTCPeerConnection({iceServers:[{
    //     urls:[
    //         "stun:stun.l.google.com:19302"
    //     ]
    // }]})

    const getUserMedia =async ()=>{
        const stream = await window.navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        }) 
        const audioTrack = stream.getAudioTracks()[0]
        const videoTrack = stream.getVideoTracks()[0]
        setLocalaudiotrack(audioTrack);
        setLocalvideotrack(videoTrack);
        if (localaudiotrack && localvideotrack) {  
        pc.addTrack(localaudiotrack);
        pc.addTrack(localvideotrack);
        }
        
        if(videoRef.current){
            videoRef.current.srcObject = stream;
        }
    }

    useEffect(()=>{
        getUserMedia();
    })

    const sendOffer = useCallback(async()=>{
        
        //if (localaudiotrack && localvideotrack) {  
        // pc.addTrack(localaudiotrack);
        // pc.addTrack(localvideotrack);
        // console.log(localaudiotrack);
        // console.log(localvideotrack);
        // console.log("added tack");
        const sdp = await pc.createOffer();
        console.log("created sdp ", sdp);
        try {
            await pc.setLocalDescription(sdp);
            socket?.emit("offer",{sdp:sdp,roomId:roomId}) ; 
        } catch (error) {
            console.log(error);
        }
    //}
    },[pc, roomId, socket])
    

    const handleAns = useCallback(async({sdp}:{sdp:string})=>{
        console.log("Recieved sdp ",sdp);
        alert("Someone wants to talk with you !! ");
        const remoteDescription = {
            type: sdp.type, // Set the type ("offer" or "answer")
            sdp: sdp.sdp,
        };
        pc.setRemoteDescription(remoteDescription);
        // const pc =  new RTCPeerConnection({iceServers:[{
        //     urls:[
        //         "stun:stun.l.google.com:19302"
        //     ]
        // }]});
        const creatSDP = await pc.createAnswer();
        socket?.emit("answer",{sdp:creatSDP,roomId});
        console.log("Create offer for ans",creatSDP);
        console.log("Recived sdp ",remoteDescription);
        },[pc, roomId, socket])

    const callAccpted = async({sdp}:{sdp:string})=>{
        console.log("SDP recieved from requested user, you requested",sdp)

    }

    useEffect(()=>{
        const randomTime = Math.random() * 1000 + 100; 
        const timerId = setTimeout(() => {
            sendOffer();
        }, randomTime);

        socket?.on("offer",handleAns);

        socket?.on("call-accepted",callAccpted)

        return ()=>{
        clearTimeout(timerId);
        socket?.off("offer",handleAns);
        socket?.off("call-accepted",callAccpted);
        }   
    },[handleAns, roomId, sendOffer, socket])


  return (
    <div>
        <p>{name}- we will soon connect you with someone</p>
        <video ref={videoRef} autoPlay ></video>
        <button>Ask to connect</button>
    </div>
  )
}

export default JoinRoom