// const  server = require('express')();
const io = require('socket.io')({
    cors:{
        origin: ["http://localhost:5173", "http://192.168.2.11:5173"]
    }})

// const cors = require('cors');
// server.use(express.json());
// server.use(express.urlencoded({ extended: true }));
// server.use(cors({
//     origin: "http://localhost:5173"
// }));


chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket)=>{
    console.log(`A user connected to chat namespace: ${socket.id} ${socket.username}`)
    socket.on('chat message', ({message, fromID, fromUsername})=>{
        console.log(`Recieved message from ${socket.username}: `, message)
        chatNamespace.emit('chat message', {message, fromID, fromUsername})
    })
})

chatNamespace.use((socket, next)=>{
    const username = socket.handshake.auth.username
    if(!username){
        return next(new Error("invalid username"))
    }
    socket.username = username
    next()
})

io.listen(3000)

// server.listen(3000, ()=>{
//     console.log("Server is running on port 3000")
// })