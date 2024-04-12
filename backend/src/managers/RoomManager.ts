import { User } from "./UserManager";


interface Room{
    user1:User,
    user2:User,
}

let ROOMS_ID_COUNT = 1;

export class RoomManager{

    private rooms:Map<string,Room>;
    constructor(){
        this.rooms = new Map<string,Room>();
    }

    createRoom(users:Room){
        const id = this.generate().toString();
        console.log("Id of room ",id);
        this.rooms.set(id,{user1:users.user1,user2:users.user2});
        console.log(this.rooms);
        const {user1,user2} = users;
        user1.socket.emit("connected-to-room",{id});
        user2.socket.emit("connected-to-room",{id});
        return;
    }
    onOffering(sdp:string,roomID:string,socket:string){
        const room = this.rooms.get(roomID);
        const recievingUser = room?.user1.socket.id === socket ? room?.user2.socket : room?.user1.socket; 
        console.log("user1 -<",socket," user2-<",recievingUser?.id);
        recievingUser?.emit("offer",{sdp});
    }

    onAnswer(sdp:string,roomID:string,socket:string){
        const room = this.rooms.get(roomID);
        const recievingUser = room?.user1.socket.id === socket ? room?.user2.socket : room?.user1.socket; 
        recievingUser?.emit("call-accepted",{sdp});
    }

    generate(){
        return ROOMS_ID_COUNT++;
    }
}