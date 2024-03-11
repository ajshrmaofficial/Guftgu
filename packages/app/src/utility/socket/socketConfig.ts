import { io } from "socket.io-client";

const URL = "https://backendapi-git-9e847d31bc95.herokuapp.com"
const chatSocket = io(URL + '/chat', {   // TODO: To decide whether to use single instance of socket for mehfil and guftgu or just stick with one...
    autoConnect: false,
    withCredentials: true,
})

function setSocketUsername(username: string){
    chatSocket.auth = {username}
}

function connectChatSocket(){
    chatSocket.connect()
}

export {chatSocket, setSocketUsername, connectChatSocket}