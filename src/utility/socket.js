import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_IP
const chatSocket = io(URL + '/chat', {
    autoConnect: false,
    withCredentials: true
})

chatSocket.onAny((event)=>{
    console.log(`Log from chatSocket(event): ${event}`)
})

function setSocketUsername(username){
    chatSocket.auth = username
}

function connectChatSocket(){
    chatSocket.connect()
}

export {chatSocket, setSocketUsername, connectChatSocket}