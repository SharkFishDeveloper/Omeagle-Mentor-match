import { useState,useEffect } from 'react'
import io from 'socket.io-client';
import {BACKEND_URL,univerOptions} from "../utils/backendUrl.js"
import axios from 'axios';
import { useSocket } from './Providers/Socket.js';



function App() {
    const [name,setName]  = useState("");
    const [school,setSchool]  = useState("");
    const [choice,setChoice] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    
    const {socket} = useSocket();


  return (
    <div>
     <h1>Home page</h1>
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
      <button>Connect :))</button>
      <br />
      <button onClick={()=>setChoice(!choice)}>{choice ? "Or enter selectively":"Change choice"}</button>
     </div>
     <p>{selectedOption}</p>
    </div>
  );
}

export default App
