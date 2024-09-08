import { io } from "socket.io-client";
import Config from "react-native-config";

const {ENV, DEV_SERVER_IP, PROD_SERVER_IP} = Config;

const URL = ENV==="development" ? DEV_SERVER_IP : PROD_SERVER_IP;
const chatSocket = io(URL + '/chat', {   // TODO: To decide whether to use single instance of socket for mehfil and guftgu or just stick with one...
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
})


function connectChatSocket(token: string){
    chatSocket.auth = {token};
    chatSocket.connect()
}

export {chatSocket, connectChatSocket}
