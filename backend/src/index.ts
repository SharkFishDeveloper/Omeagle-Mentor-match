import express from "express"; 
import { Server, Socket } from "socket.io";
import http from "http"; 
import cors from "cors"; 
import {UserManager} from "./managers/UserManager"

const app = express();
app.use(express.json());
app.use(cors())
const server  = http.createServer(app);

const io = new Server(server,{
    cors:{
      origin: "*"
    }
});
const userManager = new UserManager();

// roomManager.joinRoom(user);
io.on('connection', (socket:Socket) => {
    console.log('A user connected',socket.id);
  


    socket.on('joinRoom',({name}:{name:string})=>{
      userManager.addUser(name,socket);
    //   const updName = name.toLowerCase();
    //   roomManager.joinRoom(updName,socket);
    //  console.log(roomManager.getUsers())
    })
    
    // Listen for messages from the client
    socket.on('clientMessage', (message) => {
      console.log('Message from client:', message);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });


app.get("/users",(req,res)=>{
    console.log("all users")
    return res.json({message:"All users"})
})

server.listen(3000,()=>{
    console.log("Server running 3000")
})