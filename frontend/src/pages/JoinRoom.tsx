import  { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {  useLocation} from 'react-router-dom'
import { useSocket } from '../Providers/Socket';
import { Link } from 'react-router-dom';


const JoinRoom = () => {
    const {state} = useLocation();
    const {name} = state;
    const socket = useSocket();
    const videoRef = useRef<HTMLVideoElement>();
    const [localaudiotrack,setLocalaudiotrack] = useState<MediaStreamTrack|null>(null);
    const [localvideotrack,setLocalvideotrack] = useState<MediaStreamTrack|null>(null);
    const [remoteaudiotrack,setRemoteaudiotrack] = useState<MediaStreamTrack|null>(null);
    const [remotevideotrack,setRemotevideotrack] = useState<MediaStreamTrack|null>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [isConnected,setisConnected] = useState(false);

    

    const getUserMedia = useCallback(async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];
        setLocalaudiotrack(audioTrack);
        setLocalvideotrack(videoTrack);
      
        // Add tracks to sendingPc if it exists
        if (sendingPc) {
          try {
            sendingPc?.addTrack(audioTrack);
            sendingPc?.addTrack(videoTrack);
            console.log("Added tracks");
          } catch (error) {
            console.log("Error in adding tracks", error);
          }
        }
      
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, [sendingPc]);
      
      useEffect(() => {
        getUserMedia();
      }, []);

    

    useEffect(()=>{

        socket?.on("connected-to-room",({id})=>{
            const pc = new RTCPeerConnection({
                iceServers:[
               {
                urls:[
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302"
                ]
                }]})
                // const randomT = Math.random() + 1000;
                // setTimeout(() => {
                    
                // }, randomT); 
                // const media = async ()=>{
                //     const stream = await window.navigator.mediaDevices.getUserMedia({
                //         audio:true,
                //         video:true
                //     }) 
                //     const audioTrack = await stream.getAudioTracks()[0]
                //     const videoTrack =await stream.getVideoTracks()[0]
                //     // console.log(audioTrack);
                    
                //     setLocalaudiotrack(audioTrack);
                //     setLocalvideotrack(videoTrack);
                //     try {
                //         await pc?.addTrack(audioTrack);
                //         await pc?.addTrack(videoTrack);
                //     console.log("Added tracks");
                    
                //     } catch (error) {
                //         console.log("error in adding tracks",error)
                //     }
                    
                //     if(videoRef.current){
                //         videoRef.current.srcObject = stream;
                //     }
                // }
                // media();

            setSendingPc(pc);
            const offerFc = async()=>{
                
                const sdp = await pc.createOffer();
                await pc.setLocalDescription(sdp);
                console.log("Creating sdp for offering ",sdp);
                
                socket.emit("offer",{sdp,roomId:id});
            }

            socket.on("ask-offer",()=>{
                offerFc();
            })
           


            socket.on("offer",async({sdp:sdpA}:{sdp:string})=>{
                try {
                    const remoteDescription = {
                        type: sdpA.type, // Set the type ("offer" or "answer")
                        sdp: sdpA.sdp,
                    };
                    await pc.setRemoteDescription(remoteDescription);
                    const creatSdp = await pc.createAnswer();
                    socket.emit("answer",{sdp:creatSdp,roomId:id})
                    console.log("Creating ans ",creatSdp);
                    
                    await pc.setLocalDescription(creatSdp);
                    console.log("Recived sdp",remoteDescription);
                    // alert("Someone invites you ")
                    // setOfferSent(false);
                } catch (error) {
                    console.error("erro in offer",error)
                }                 
            });
            

            socket?.on("call-accepted",async({sdp:sdpc}:{sdp:any})=>{
                console.log("After calling ",sdpc);
                await pc.setRemoteDescription(sdpc);
                // alert("Call-accepted")
            })
            pc.onicecandidate = ()=>{
                console.log("Ice local");
                offerFc();
            }
            return ()=>{
                socket.off();
            }
        })
    },[socket])





  return (
    <div>
        <p>{name}- we will soon connect you with someone</p>
        <video ref={videoRef} autoPlay ></video>
        <Link to={"/"} onClick={window.location.reload}><h1>Home page</h1></Link>
    </div>
  )
}

export default JoinRoom;



                // try {
                // if(localaudiotrack && localvideotrack){
                //     pc.addTrack(localaudiotrack);
                // pc.addTrack(localvideotrack);
                // }
                // } catch (error) {
                //     console.error(error);
                // }
                // if (localaudiotrack) {
                //     console.error("added tack");
                //     console.log(localaudiotrack)
                //     pc.addTrack(localaudiotrack)
                // }
                // if (localvideotrack) {
                //     console.error("added tack");
                //     console.log(localvideotrack)
                //     pc.addTrack(localvideotrack)
                // }