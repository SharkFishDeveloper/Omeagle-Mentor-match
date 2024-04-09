import { createContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = (props)=>{
    const socket = useMemo(()=>io({
        host:"http://localhost",
        port:3000
    }),[]);
    return (
        <SocketContext.Provider value={{socket}}>
        {props.children}
        </SocketContext.Provider>
    );
   
}