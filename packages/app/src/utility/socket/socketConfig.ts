import { io } from "socket.io-client";
import Config from "react-native-config";
import useUserStore from "../store/userStore";

const {ENV, DEV_SERVER_IP, PROD_SERVER_IP} = Config;

const URL = ENV==="development" ? DEV_SERVER_IP : PROD_SERVER_IP;
const chatSocket = io(URL + '/chat', {   // TODO: To decide whether to use single instance of socket for mehfil and guftgu or just stick with one...
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
})


function connectChatSocket(){
    const token = useUserStore(state => state.authToken);

    chatSocket.auth = {token};
    chatSocket.connect()
}

export {chatSocket, connectChatSocket}
