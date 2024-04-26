import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";
import { BACKEND_URL } from "../../utils/backendUrl";
import axios from "axios";

const SocketContext = createContext<Socket|undefined>(undefined);

export interface User{
     id:string,
     email:string,
     password:string,
     username:string,
     imageUrl?:string,
     roomId?:string[],
     mentorName?:string[]
}

export interface Mentor {
    id: string;
    email: string;
    password: string;
    username: string;
    university: string;
    specializations: string[];
    rating: number;
    userMentored: number;
    mentoredId: string[];
    comments: string[];
    imageUrl?: string | null;
    popularity: number;
    timeslots: number[];
    usersName: string[];
    roomId: string[];
    price: number;
  }
  
// "id": "5814d73d-e7a7-4211-938b-89b65887d1bc",
//         "email": "world@w.com",
//         "password": "$2b$10$n7o9kuCriQE/kWDD8T8hrebmnxOdtzxxzKQho1As5ALxO0q4rOsz6",
//         "username": "world",
//         "imageUrl": null,
//         "roomId": [],
//         "mentorName": []
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
const UserContext = createContext<{ user: User|Mentor| null; setUser: React.Dispatch<React.SetStateAction<User | null>> } | undefined>(undefined);

export const useUser = () => {
  return useContext(UserContext);
};
export type UserType = User | Mentor;
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<UserType|null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let response = await axios.get(`${BACKEND_URL}/app/user`,{withCredentials:true});
        if(response.data.message=== "No user exists !!"){
          
          console.log(response.data)
        } 
        else{
          response = await axios.get(`${BACKEND_URL}/app/mentor`,{withCredentials:true});
          setUser(response.data.user);
        }
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};