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
    }, [socket]);
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
        const userToken = localStorage.getItem('token');
        
        console.log(userToken);// Assuming you store the token in localStorage
        if (userToken) {
          // If a token exists, make a request to fetch user data
          let response = await axios.get(`${BACKEND_URL}/app/user`, { withCredentials: true });
          if (response.data.message === 'success') {
            setUser(response.data.user);
          } else {
            // If the user data request fails or indicates no user exists, assume the user is a mentor
            response = await axios.get(`${BACKEND_URL}/app/mentor`, { withCredentials: true });
            setUser(response.data.user);
          }
        } else {
          // If no token exists, assume the user is not logged in
          console.log('No user token found. User is not logged in.');
        }
      } catch (error) {
        // Handle errors
        if (error.response) {
          console.error('Error response from server:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error fetching user:', error);
        }
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