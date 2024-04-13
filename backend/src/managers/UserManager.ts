import { Socket } from "socket.io"
import { RoomManager } from "./RoomManager";

export interface User {
    socket:Socket,
    name:string
}

export class UserManager{
    private users:User[];
    private queue:string[];
    private roomManager ;
    constructor(){
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
    }

    
    addUser(name:string,socket:Socket){
        const findSID = this.queue.find(id=>id === socket.id);
        if(findSID){
            console.log("User already exists ")
            return;
        } 
        this.users.push({name,socket});
        this.queue.push(socket.id);
        //! emit something
        this.clearQueue();
        this.handleOffer(socket);
    }
    clearQueue(){
        if(this.queue.length < 2){
            return;
        }
        const person1 = this.queue.pop();
        const person2 = this.queue.pop();
        const user1 = this.users.find(user=>user.socket.id === person1);
        const user2 = this.users.find(user=>user.socket.id === person2);
        console.log("ID-1 ",person1," ID-2 ",person2);
        console.log("creating a room ");
        if (!user1 || !user2) {
            return;
        }
        const room = this.roomManager.createRoom({user1,user2});

    }
    handleOffer(socket:Socket){
        socket.on("offer",({sdp,roomId}:{sdp:string,roomId:string})=>{
            console.log("Calling - SDP",sdp,);
            this.roomManager.onOffering(sdp,roomId,socket.id);
        })
        socket.on("answer",({sdp,roomId}:{sdp:string,roomId:string})=>{
            console.log("Answering user -> SDP");
            this.roomManager.onAnswer(sdp,roomId,socket.id);
        })
    }
}