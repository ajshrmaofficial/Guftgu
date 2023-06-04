import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_IP
const chatSocket = io(URL + '/chat', {
    autoConnect: false,
    withCredentials: true
})

function setSocketUsername(username){
    chatSocket.auth = {username}
}

function connectChatSocket(){
    console.log(chatSocket.auth.username)
    chatSocket.connect()
}

export {chatSocket, setSocketUsername, connectChatSocket}