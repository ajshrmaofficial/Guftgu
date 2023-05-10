require('dotenv').config()
const express = require('express')
const  server = express()
const http = require('http')
const httpServer = http.createServer(server)
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { sessionMiddleware, redisClient } = require('./sessionManager')
const authRouter = require('./authRouter')

const corsConfig = {
    origin: process.env.FRONTEND_IP,
    credentials: true
}

const io = require('socket.io')(httpServer, {
    cors: corsConfig
})

async function connectRedis() {
    await redisClient.connect()
}
connectRedis()

server.use(cors(corsConfig));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser())
server.use(sessionMiddleware)
server.use('/auth', authRouter)
io.engine.use(sessionMiddleware)

redisClient.on('connect', ()=>{
    console.log('connected to redis')
})

redisClient.on('error', (err)=>{
    console.log('Could not establish connection to redis: ' + err)
})

chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket)=>{
    console.log('Socket.io sessionID: '+JSON.stringify(socket.request.sessionID))
    console.log(`A user connected to chat namespace: ${socket.id} ${socket.username}`)
    socket.on('chat message', (message)=>{
        console.log(`Recieved message from ${socket.username}: `, message)
        chatNamespace.emit('chat message', {message, fromID: socket.id, fromUsername: socket.username})
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

httpServer.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})