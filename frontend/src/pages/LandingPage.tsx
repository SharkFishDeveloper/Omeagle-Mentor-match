import { useState, useEffect, useRef } from 'react';
import { BACKEND_URL, univerOptions } from '../../utils/backendUrl.js';
import { useSocket, useUser } from '../Providers/Socket.js';
import { useNavigate } from 'react-router-dom';
import JoinRoom from './JoinRoom';

function LandingPage() {
  const user = useUser();
  const router = useNavigate();
  const [name, setName] = useState(user ? user?.user?.username : '');
  const roomId = user?.user?.roomId.length;
  const [school, setSchool] = useState('');
  const [choice, setChoice] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const socket = useSocket();
  const [localaudiotrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localvideotrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [joined, setJoined] = useState(false);
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roomIdConnect, setRoomIdConnect] = useState('');

  async function GetMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalAudioTrack(stream.getAudioTracks()[0]);
    setLocalVideoTrack(stream.getVideoTracks()[0]);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }
  useEffect(() => {
    if (videoRef && videoRef.current) {
      if (joined) {
        GetMedia();
      }
    }
  }, [joined]);

  const handleJoinRoom = () => {
    let universityToSend = selectedOption;
    if (roomIdConnect) {
      universityToSend = roomIdConnect;
    }
    socket!.emit('joinRoom', { name, university: universityToSend });
    if (localaudiotrack && localvideotrack) {
      setOpen(!open);
    }
  };

  if (open) {
    return <JoinRoom name={name} localaudiotrack={localaudiotrack} localvideotrack={localvideotrack} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[80%]">
      <h1 className="text-3xl font-bold mb-8 mt-5">Landing page</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => router('/home')}>
        Mentor-match
      </button>
      <p className="mt-4 mb-2">Connect with anyone</p>
      <div className="flex flex-col items-center">
        <p>Enter name</p>
        <input
          type="text"
          placeholder={name}
          className="border border-gray-300 rounded px-2 py-1 mt-2 mb-4 focus:outline-none"
          onChange={(e) => setName(e.target.value)}
        />
        {!choice && (
          <div className="flex flex-wrap justify-between w-full max-w-md">
            {univerOptions.map((options, index) => (
              <div key={index} onClick={() => setSelectedOption(options)} className="cursor-pointer hover:bg-gray-100 rounded px-2 py-1 mt-2">
                {options}
              </div>
            ))}
          </div>
        )}
        {!choice && (
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4" onClick={() => setSelectedOption('')}>
            Clear option
          </button>
        )}
        {!joined ? (
          <p onClick={() => setJoined(!joined)} className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
            Start
          </p>
        ) : (
          <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleJoinRoom}>
              Connect :))
            </button>
          </>
        )}
        <br />
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4" onClick={() => setChoice(!choice)}>
          {choice ? 'Or enter selectively' : 'Change choice'}
        </button>
      </div>
      {roomId > 0 ? (
        <input
          type="text"
          placeholder="Enter roomId"
          className="border border-gray-300 rounded px-2 py-1 mt-4 focus:outline-none"
          onChange={(e) => setRoomIdConnect(e.target.value)}
        />
      ) : null}
      <p className="mt-4">{selectedOption}</p>
      <video ref={videoRef} autoPlay muted playsInline className="max-w-full max-h-full mt-4" />
     
    </div>
  );
}

export default LandingPage;
