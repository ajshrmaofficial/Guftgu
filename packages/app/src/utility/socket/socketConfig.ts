import { io } from "socket.io-client";
import { SERVER_IP } from "@env";

const URL = SERVER_IP;
const chatSocket = io(URL + '/chat', {   // TODO: To decide whether to use single instance of socket for mehfil and guftgu or just stick with one...
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
})

function setSocketUsername(username: string){
    chatSocket.auth = {username};
}

function connectChatSocket(){
    chatSocket.connect()
}

export {chatSocket, setSocketUsername, connectChatSocket}