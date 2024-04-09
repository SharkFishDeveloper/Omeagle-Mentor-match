import express from "express"; 
import { Server, Socket } from "socket.io";
import http from "http"; 
import cors from "cors"; 

const app = express();
app.use(express.json());
app.use(cors())
const server  = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

io.on('connection', (socket:Socket) => {
    console.log('A user connected',socket);
    // Send a message to the client when they connect
    socket.emit('message', 'Welcome! Your connection with the server is established.');
    
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