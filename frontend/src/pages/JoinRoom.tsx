import  { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import { Link } from 'react-router-dom';


const JoinRoom = ({name,localaudiotrack,localvideotrack}:
  {
    name: string,
    localaudiotrack: MediaStreamTrack | null,
    localvideotrack: MediaStreamTrack | null,
  }
  ) => {
    const socket = useSocket();
    const videoRef = useRef<HTMLVideoElement>();
    const [remoteaudiotrack,setRemoteaudiotrack] = useState<MediaStreamTrack|null>(null);
    const [remotevideotrack,setRemotevideotrack] = useState<MediaStreamTrack|null>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [isConnected,setisConnected] = useState(false);
    const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>();
    
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

          if(localaudiotrack && localvideotrack){
            pc.addTrack(localaudiotrack!); 
            pc.addTrack(localvideotrack!);  
          } else{
            return;
          }


            const offer = async()=>{
            const offerC =await pc.createOffer();
            await pc.setLocalDescription(offerC);
            console.log("Creating sdp for offering ",offerC);
                  
            socket.emit("offer",{sdp:offerC,roomId:id});
            }
          

          socket.on("ask-offer",offer);
            
            
            socket?.on("offer",async({sdp:sdpA}:{sdp:string})=>{
                const pc = new RTCPeerConnection(); //! 
                const remoteDescription = {
                  type: sdpA.type, // Set the type ("offer" or "answer")
                  sdp: sdpA.sdp,
                  };
                  console.log("recieved sdp after offering ",remoteDescription)
                  await pc.setRemoteDescription(remoteDescription);
                  const creatSdp = await pc.createAnswer();
                  socket.emit("answer",{sdp:creatSdp,roomId:id})
                  await pc.setLocalDescription(creatSdp);
              console.log("Creating ans ",creatSdp);
            })

            socket.on("call-accepted",async({sdp})=>{
              console.log("call-accepted sdp  ",sdp)
              await pc.setRemoteDescription(sdp);
              alert("Call-accepted")
            })

            pc.onnegotiationneeded = async()=>{
              
              console.log("on negotiation neeeded, sending offer");
              offer();
            }
            // pc.onicecandidate = ()=>{
            //   offer();
            //   console.log("Gie ice")
            // }
            
          })
          return ()=>{
            socket?.off();
          }
    },[socket])
         
  useEffect(()=>{
    if (localVideoRef && localaudiotrack && localvideotrack) {
      const mediaStream = new MediaStream([localaudiotrack, localvideotrack]);
      localVideoRef.current.srcObject = mediaStream;
    }
  },[localaudiotrack, localvideotrack])

  return (
    <div>
        <p>{name}- we will soon connect you with someone</p>
        <video autoPlay width={400} height={400} ref={localVideoRef} />
        <Link to={"/"} onClick={window.location.reload}><h1>Home page</h1></Link>
    </div>
  )
}



export default JoinRoom;
        
        // socket.on("ask-offer",()=>{

        //     const creeatOffer = async()=>{
        //     const offer =await pc.createOffer();
        //     await pc.setLocalDescription(offer);
        //     console.log("Creating sdp for offering ",offer);
                  
        //     socket.emit("offer",{sdp:offer,roomId:id});
        //     }
        //     creeatOffer();
        //     })

        //         socket.on("offer",async({sdp:sdpA}:{sdp:string})=>{
        //           alert("Someone wantst to connect")
        //           const remoteDescription = {
        //               type: sdpA.type, // Set the type ("offer" or "answer")
        //               sdp: sdpA.sdp,
        //               };
        //           await pc.setRemoteDescription(remoteDescription);
        //           const creatSdp = await pc.createAnswer();
        //           socket.emit("answer",{sdp:creatSdp,roomId:id})
        //           console.log("Creating ans ",creatSdp);
        //         })


                


    // useEffect(() => {
    //   console.log("Audio track:", localaudiotrack);
    //   console.log("Video track:", localvideotrack);
    // }, [localaudiotrack,localvideotrack]);
    
    // useEffect(()=>{

    //     socket?.on("connected-to-room",({id})=>{
    //         const pc = new RTCPeerConnection({
    //             iceServers:[
    //            {
    //             urls:[
    //                 "stun:stun.l.google.com:19302",
    //                 "stun:stun1.l.google.com:19302"
    //             ]
    //             }]})             
    //              getUserMedia(pc);

    //             if(localaudiotrack && localvideotrack){
    //               console.log("in fx");
                  
    //             }
    //         setSendingPc(pc);
    //         if(localaudiotrack && localvideotrack){
              
    //           const offerFc = async()=>{
    //             console.log("Insidemain fx ");
                
    //             const sdp = await pc.createOffer();
    //             await pc.setLocalDescription(sdp);
    //             console.log("Creating sdp for offering ",sdp);
                
    //             socket.emit("offer",{sdp,roomId:id});
    //           }

    //           socket.on("ask-offer",()=>{
    //             offerFc();
    //           })
           


    //           socket.on("offer",async({sdp:sdpA}:{sdp:string})=>{
    //             try {
    //                 const remoteDescription = {
    //                     type: sdpA.type, // Set the type ("offer" or "answer")
    //                     sdp: sdpA.sdp,
    //                 };
    //                 await pc.setRemoteDescription(remoteDescription);
    //                 const creatSdp = await pc.createAnswer();
    //                 socket.emit("answer",{sdp:creatSdp,roomId:id})
    //                 console.log("Creating ans ",creatSdp);
                    
    //                 await pc.setLocalDescription(creatSdp);
    //                 console.log("Recived sdp",remoteDescription);
    //                 // alert("Someone invites you ")
    //                 // setOfferSent(false);
    //             } catch (error) {
    //                 console.error("erro in offer",error)
    //             }                 
    //           });
            

    //           socket?.on("call-accepted",async({sdp:sdpc}:{sdp:any})=>{
    //             console.log("After calling ",sdpc);
    //             await pc.setRemoteDescription(sdpc);
    //           })
    //           pc.onicecandidate = ()=>{
    //             console.log("Ice local");
    //             offerFc();
    //           }
    //         }
    //         return ()=>{
    //             socket.off();
    //         }
    //     })
    // },[getUserMedia, localaudiotrack, localvideotrack, socket])




