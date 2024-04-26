import  { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";

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
    const [sender,setSender] = useState(false);
    const [remotemediastream,setRemotemediastream] = useState<MediaStream|null>();
    const remoteVideoRef = useRef<HTMLVideoElement>();
    const [user2name,setuser2name] = useState<string|null>();
    const [message, setMessage] = useState('');
    const [sendmessages, setsendmessages] = useState([]);
    const [receivedMessages, setreceivedMessages] = useState([]);
    const [roomId,setRoomId] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
      socket?.on("connected-to-room",({id,username})=>{
        setuser2name(username);
        setRoomId(id);
        const pc = new RTCPeerConnection({
          iceServers:[
         {
          urls:[
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302"
          ]
          }]})   
          setSendingPc(pc);
          if(localaudiotrack && localvideotrack){
            pc.addTrack(localaudiotrack!); 
            pc.addTrack(localvideotrack!);  
          } else{
            return;
          }

          pc.onnegotiationneeded = async()=>{
            const sdp = await pc.createOffer();
            pc.setLocalDescription(sdp);
            socket.emit("offer",{sdp,roomId:id});
            // offer();
            console.log("on negotiation neeeded, sending offer");
          }

          pc.onicecandidate =async (e)=>{
            console.log("sending ice ,sender")
            if(e.candidate){
              socket.emit("add-ice-candidate",{
                candidate:e.candidate,
                type:"sender",
                roomId:id
              })
            }
          }

            socket?.on("add-ice-candidate",({candidate,type})=>{
              console.log("REcieviig ice locally")
              if(type == "sender"){
                setReceivingPc(pc=>{
                  pc?.addIceCandidate(candidate);
                })
              }else{
                setSendingPc(pc=>{
                  pc?.addIceCandidate(candidate);
                })
              }
            })
            
            socket?.on("offer",async({sdp:sdpA}:{sdp:string})=>{
              const pc = new RTCPeerConnection();
                const remoteDescription = {
                  type: sdpA.type, // Set the type ("offer" or "answer")
                  sdp: sdpA.sdp,
                  };
                  setReceivingPc(pc); 
                  const stream = new MediaStream();
                  remoteVideoRef.current.srcObject = stream;
                  // if(remoteVideoRef.current){
                  //   remoteVideoRef.current.srcObject = stream;
                  // }
                  setRemotemediastream(stream);
                  window.pcr = pc;
                  console.log("recieved sdp after offering ",remoteDescription)
                  await pc.setRemoteDescription(remoteDescription);



                  const creatSdp = await pc.createAnswer();
                  socket.emit("answer",{sdp:creatSdp,roomId:id})
                  await pc.setLocalDescription(creatSdp);

                  pc.onicecandidate = (e)=>{
                    console.log("sending ice ,receiver")
                    socket.emit("add-ice-candidate",{candidate:e.candidate,
                      type:"receiver"
                    })
                  }



                  pc.ontrack = ({track,type})=>{
                    alert("on tracks")

                  }
              console.log("Creating ans ",creatSdp);
              const track1 = pc.getTransceivers()[0].receiver.track;
            const track2 = pc.getTransceivers()[1].receiver.track;
            console.log(track1,track2);
            if(track1.kind == "audio"){
              //@ts-ignore
              setRemoteaudiotrack(track1);
              setRemotevideotrack(track2);
              
              // setRemoteaudiotrack(track);
            }else if(track1.kind=="video"){
              //@ts-ignore
              setRemoteaudiotrack(track1);
              setRemotevideotrack(track2)        
                                   
            }
            if(remoteVideoRef.current.srcObject){
              remoteVideoRef.current.srcObject.addTrack(track1);
            remoteVideoRef.current.srcObject.addTrack(track2);
            }else{
              console.error("not added in srcObj")
            }
            remoteVideoRef.current?.play();
            })

            
            socket.on("call-accepted",async({sdp})=>{
              console.log("call-accepted sdp  ",sdp)
              setSendingPc(pc=>{
                pc?.setRemoteDescription(sdp)
                return pc;
              })
            })


            
          })
          return ()=>{
            socket?.off();
          }
    },[socket, sender, localaudiotrack])
         
  useEffect(()=>{
    // /localVideoRef && localaudiotrack && 
    if (localvideotrack) {
      //localaudiotrack,
      const mediaStream = new MediaStream([ localvideotrack]);
      localVideoRef.current.srcObject = mediaStream;
    }
  },[localaudiotrack, localvideotrack])


  const sendMessage = ()=>{
    try {
      socket?.emit("send-message",message);
      setsendmessages([...sendmessages,message])
      console.log("send-message",message);
      setMessage("");
    } catch (error) {
      console.log(error);
      setMessage('');
    }
    console.log("clikced")
  }

  useEffect(() => {
    // Listen for incoming messages
    socket?.on('receive-message', message=> {
      setreceivedMessages([...receivedMessages, message]);
      console.log('receive-message', message);
  });

    return () => {
        // Disconnect socket when component unmounts
        socket?.off("send-message");
        socket?.off("receive-message");
 
    };
}, [message, receivedMessages, socket]);






  return (
    <div>
        {user2name ? (<p>{name} - You are currently communicating </p>):(<p>Finding someone</p>)}
        <video autoPlay width={400} height={400} ref={localVideoRef} />
        {/* {remotevideotrack ? ( */}
          <video autoPlay width={400} height={400} ref={remoteVideoRef} />
        {/* ):(null)} */}
        {user2name ? (<p>Connected with - {user2name}</p>):(<p>Connecting to someone ...</p>)}
        <div>
        <div className="h-screen flex flex-col">
            <div className="flex-grow overflow-y-auto">
                {sendmessages.map((msg, index) => (
                    <div key={index} className="flex justify-end mb-2">
                        <div className="bg-blue-500 text-white text-md p-2 rounded-lg">
                            {msg}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-grow overflow-y-auto">
                {receivedMessages.map((msg, index) => (
                    <div key={index} className="flex justify-end mb-2">
                        <div className="bg-green-400 text-white text-md p-2 rounded-lg">
                            {msg}
                        </div>
                    </div>
                ))}


            </div>
            <div className="flex-grow overflow-y-auto bg-gray-100 p-4">
    {receivedMessages.map((msg, index) => (
        <div key={index} className="flex justify-start mb-2">
            <div className="bg-blue-500 text-white text-md p-3 rounded-lg">
                {msg}
            </div>
        </div>
    ))}
</div>


<div>
    <button className="rounded bg-red-500 h-[3rem] w-[5rem] items-center justify-center flex hover:scale-110 transition-all" onClick={()=>{
      window.location.reload();
      navigate("/")
    }}>
        <FaPhoneAlt className="text-white"></FaPhoneAlt>
    </button>
</div>


<div className="flex justify-center p-4">
    <input
        type="text"
        className="border border-gray-300 rounded-l-lg p-3 w-full focus:outline-none focus:border-blue-500"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
    />
    <button
        className="bg-blue-500 text-white px-6 py-3 rounded-r-lg ml-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        onClick={sendMessage}
    >
        Send
    </button>
</div>
        </div>




     </div>
        <Link to={"/"} onClick={()=>window.location.reload()}><h1>Home page</h1></Link>
    </div>
  )
}



export default JoinRoom;
