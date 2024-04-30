import  { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import "./video.css"


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
  <div className="flex bg-black h-screen">
    <div className='container'>
    <div className="background">
      <div id='other-wrapper'>
        <video id='main' autoPlay ref={localVideoRef} />
        <video id='other' autoPlay ref={remoteVideoRef} />
        <div id='endcall'>
          <button className="rounded bg-red-500 h-[3rem] w-[5rem] items-center justify-center flex hover:scale-110 transition-all" onClick={() => {
            window.location.reload();
            navigate("/")
          }}>
            <FaPhoneAlt className="text-white"></FaPhoneAlt>
          </button>
        </div>
      </div>

      <div className="chat-wrapper bg-gray-100 h-[90%] overflow-hidden">
  <h3 className="text-lg font-semibold mb-4">Meeting Details</h3>

  {/* Chat Header */}
  <div className="chat-header bg-gray-100 py-2 px-4 rounded-t-lg">
    <h4 className="text-lg font-semibold">Chat</h4>
  </div>

  {/* Chat Messages */}
  <div className="chat-messages bg-white rounded-b-lg shadow-md overflow-hidden rounded-lg mx-auto">
  {user2name ? (<p className="text-small font-semibold">{name} - You are currently communicating with - {user2name}</p>):(<p>Finding someone</p>)}
    <div className="max-w-sm mx-4">
      <div className="h-80 overflow-y-auto">

        {/* Sent Messages */}
        {sendmessages.map((msg, index) => (
          <div key={index} className="flex justify-end items-center px-4 py-2">
            <div className="bg-blue-500 text-white text-sm p-2 rounded-lg">
              {msg}
            </div>
          </div>
        ))}

        {/* Received Messages */}
        {receivedMessages.map((msg, index) => (
          <div key={index} className="flex justify-start items-center px-2 py-2">
            <div className="bg-green-400 text-white text-sm p-2 rounded-lg">
              {msg}
            </div>
          </div>
        ))}

      </div>

      {/* Message Input */}
      <div className="flex items-center border-t border-gray-300">
        <input
          type="text"
          className="flex-1 p-1 focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  </div>
</div>


      {/* <Link to={"/"} onClick={() => window.location.reload()}><h1>Home page</h1></Link> */}
    </div>

    </div>
  </div>
  )
}



export default JoinRoom;
