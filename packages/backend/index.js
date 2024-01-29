require('dotenv').config()
const express = require('express')
const  server = express()
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { sessionMiddleware, redisClient } = require('./auth/sessionManager')
const authRouter = require('./auth/authRouter')

var httpServer // setup for https server in production
if(process.env.NODE_ENV === 'production'){
    const fs = require('fs')
    const https = require('https')
    const privateKey = fs.readFileSync('./privkey.pem', 'utf8')
    const certificate = fs.readFileSync('./cert.pem', 'utf8')
    const credentials = {key: privateKey, cert: certificate}
    httpServer = https.createServer(credentials, server)
} else {
    const http = require('http')
    httpServer = http.createServer(server)
}

const corsConfig = {
    origin: process.env.FRONTEND_IP,
    credentials: true
}

const io = require('socket.io')(httpServer, {
    cors: corsConfig,
})

async function connectRedis() { // connecting to redis server
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
// TODO: add authentication/authorization to chat namespace (maybe use jwt token)
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

// module.exports = io