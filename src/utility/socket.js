import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_IP
const env = import.meta.env.VITE_ENV
const chatSocket = io(URL + '/chat', {
    autoConnect: false,
    withCredentials: true,
    secure: env === 'production' ? true : false,
})

function setSocketUsername(username){
    chatSocket.auth = {username}
}

function connectChatSocket(){
    chatSocket.connect()
}

export {chatSocket, setSocketUsername, connectChatSocket}