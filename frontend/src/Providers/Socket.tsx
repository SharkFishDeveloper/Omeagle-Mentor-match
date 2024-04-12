import { createContext, useContext, useEffect, useMemo } from "react";
import { Socket, io } from "socket.io-client";
import { BACKEND_URL } from "../../utils/backendUrl";

const SocketContext = createContext<Socket|undefined>(undefined);




export const useSocket = (): Socket | undefined => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socket;
}
export const SocketProvider = (props:any)=>{
    const socket = useMemo(()=>io(BACKEND_URL),[]);
    useEffect(() => {
        try {
            socket.connect();
        } catch (error) {
            console.log("Error in socket conn. ",error)
        }
        return () => {
            socket.disconnect();
        };
    }, [socket]); // Ensure to re-establish connection if socket changesu
    return (
        <SocketContext.Provider value={socket}>
        {props.children}
        </SocketContext.Provider>
    );
   
}