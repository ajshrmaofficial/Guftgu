import { io } from "socket.io-client";

const URL = "http://192.168.2.11:3000"

const chatSocket = io(URL + '/chat', {autoConnect: false})

chatSocket.onAny((event)=>{
    console.log(`Log from chatSocket(event): ${event}`)
})

export default chatSocket