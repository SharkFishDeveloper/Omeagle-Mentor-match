import { Socket } from "socket.io"
import { RoomManager } from "./RoomManager";

export interface User {
    socket:Socket,
    name:string
}

export interface UniversUser{
    socket:Socket,
    name:string,
    university?:string
}

export class UserManager{
    private users:User[];
    private bigusers:UniversUser[];
    private queue:string[];
    private bigqueue:string[];
    private roomManager ;
    constructor(){
    this.users = [];
    this.queue = [];
    this.bigusers = [];
    this.bigqueue = [];
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

    addBigUser(name:string,socket:Socket,university?:string){
        const findSID = this.queue.find(id=>id === socket.id);
        if(findSID){
            console.log("User already exists ")
            return;
        } 
        this.bigusers.push({name,socket,university});
        this.bigqueue.push(socket.id);
        this.clearBigUser();
        this.handleOffer(socket);
    }

    clearBigUser(){
        if(this.bigqueue.length < 2){
            return;
        }
        
        const person1 = this.bigqueue.pop(); 
        const user1 = this.bigusers.find(user=>user.socket.id === person1);
        var findPerson = this.bigusers.find(user => {
    if (!user1 || !user) {
        return false; // Consider handling this case based on your logic
    }
    return user.socket.id !== user1.socket.id && user.university === user1.university;
});
        console.log("read this",user1?.name,findPerson?.name);
        if(!findPerson || user1?.name === findPerson.name){
            console.log("I am cancelling")
            console.log;(user1?.socket.id , findPerson?.socket.id)
           if(user1?.socket.id){
            this.bigqueue.push(user1?.socket.id)
           }
            return;
        }
            console.log(findPerson.name);
            console.log(user1?.name)
        const person2Id = findPerson?.socket.id;
        console.log(person2Id);

        if(person2Id){
            const person2Index = this.bigqueue.indexOf(person2Id);
            if(person2Index){

                this.bigqueue.splice(person2Index, 1);
            }
        }

        if (!user1 || !findPerson) {
            return;
        }
        if(user1?.socket && user1.name && findPerson?.socket && findPerson.name){
            const finalUser1:User = {name:user1?.name ,socket:user1?.socket}; 
            const finalUser2:User = {name:findPerson?.name ,socket:findPerson?.socket}; 
            console.log("user1 connecting", finalUser1.name,"user2 connecting",finalUser2.name);
            if(finalUser1.socket.id===finalUser2.socket.id){
                console.log("Over here");
                
                return;
            }
            const room = this.roomManager.createRoom({ user1: finalUser1, user2: finalUser2 });
            // console.log("Creating a university room",user1);
        }
        // const finalUser2:User = {name:user2?.name|| "",socket:user2?.socket|| ""}; 
        // console.log("ID-1 universe",user1?.name, user1?.university);
        // console.log("ID-1 universe",user2?.name, user2?.university);
        // console.log("creating a room ");
       
        // console.log("Creating a university room",user1," ",user2);
        // const room = this.roomManager.createRoom({user1,user2});
    }







    clearQueue(){
        if(this.queue.length < 2){
            return;
        }
        const person1 = this.queue.pop();
        const person2 = this.queue.pop();
        const user1 = this.users.find(user=>user.socket.id === person1);
        const user2 = this.users.find(user=>user.socket.id === person2);
        //console.log("ID-1 ",person1," ID-2 ",person2);
        console.log("creating a room ");
        if (!user1 || !user2) {
            return;
        }
        const room = this.roomManager.createRoom({user1,user2});
        console.log("Conected to Room",room)
        this.onChatting(user1,user2,room);
    }


    onChatting(user1:User,user2:User,room:string){
        console.log("when sedning messages or receing")
        user1.socket.join(room);
        user2.socket.join(room);
        user1.socket.on("send-message",(text)=>{
        console.log("Sednign message ",text);
        user2.socket.emit("receive-message",text);
    })}



    
    handleOffer(socket:Socket){
        socket.on("offer",({sdp,roomId}:{sdp:string,roomId:string})=>{
        //    console.log("Calling - SDP",sdp);
           this.roomManager.onOffering(sdp,roomId,socket.id);
        })
        socket.on("answer",({sdp,roomId}:{sdp:string,roomId:string})=>{
            //console.log("Answering user -> SDP",sdp);
            this.roomManager.onAnswer(sdp,roomId,socket.id);
        })
        socket.on("add-ice-candidate", ({candidate, roomId, type}) => {
            // console.log("Ice running in backend");          
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });

    }
}