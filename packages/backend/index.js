require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sessionMiddleware, redisClient } = require("./auth/sessionManager");
const authRouter = require("./auth/authRouter");
const messageModel = require("./schema/messageSchema");
const userRouter = require("./auth/userRouter");
const userModel = require("./schema/userSchema");
const { firebase } = require("./utils/firebase");

var httpServer; // setup for https server in production
if (process.env.USING_HEROKU === "false") {
  // if not using heroku, use https (because heroku provides ssl certificate for free, so no need to use https in heroku deployment)
  const fs = require("fs");
  const https = require("https");
  const privateKey = fs.readFileSync("./privkey.pem", "utf8");
  const certificate = fs.readFileSync("./cert.pem", "utf8");
  console.log("privateKey: ", privateKey);
  console.log("certificate: ", certificate);
  const credentials = { key: privateKey, cert: certificate };
  httpServer = https.createServer(credentials, server);
} else {
  const http = require("http");
  httpServer = http.createServer(server);
}

const corsConfig = {
  origin: process.env.FRONTEND_IP,
  credentials: true,
};

const io = require("socket.io")(httpServer, {
  cors: corsConfig,
});

// async function connectRedis() { // connecting to redis server
//     await redisClient.connect()
// }
// connectRedis()

server.use(cors(corsConfig));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
// server.use(sessionMiddleware)
server.use("/auth", authRouter);
server.use("/user", userRouter);
// io.engine.use(sessionMiddleware)

// redisClient.on('connect', ()=>{
//     console.log('connected to redis')
// })

// redisClient.on('error', (err)=>{
//     console.log('Could not establish connection to redis: ' + err)
// })

server.get("/", (req, res) => {
  res.send("Hello from Guftgu server 👋");
});

io.engine.on("connection_error", (err) => {
  console.log("socket.io connection error: ", err);
});

const sendNotification = async (messageBody, screen) => {
  if(screen === 'Mehfil'){
    const users = await userModel.find();
    const messageData = {
      tokens: [],
      notification: {
        title: 'New message in Mehfil',
        body: messageBody
      },
      data: {
        screen: screen,
        message: messageBody
      }
    }
    users.forEach(user => {
      if(user.fcmToken){
        messageData.tokens.push(user.fcmToken);
      }
    });
    firebase.messaging().sendEachForMulticast(messageData);
  } else if(screen === 'Guftgu'){
    const findUser = await userModel.findOne({username: toUsername});
    if(findUser && findUser.fcmToken){
      console.log('sending fcm notification to ', toUsername);
      const messageData = {
        token: findUser.fcmToken,
        notification: {
          title: 'New message from ' + socket.username,
          body: message
        },
        data: {
          screen: screen,
          message: message,
          fromUsername: socket.username
        }
      }
      firebase.messaging().send(messageData)
        .then((response) => {
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }
  }
}

const chatNamespace = io.of("/chat");
const users = {};
// TODO: add authentication/authorization to chat namespace (maybe use jwt token)
chatNamespace.on("connection", (socket) => {
  console.log(
    "Socket.io sessionID: " + JSON.stringify(socket.request.sessionID),
  );
  console.log(
    `A user connected to chat namespace: ${socket.id} ${socket.username}`,
  );
  socket.join(socket.username);
  users[socket.username] = socket.username;

  socket.on("disconnect", () => {
    console.log(`User ${socket.username} disconnected`);
    delete users[socket.username];
  });

  socket.on("isOnline", (username) =>{
    console.log(`Checking if ${username} is online`);
    if(users[username]){
      socket.to(socket.username).emit("isOnline", {username, isOnline: true});
    }
    else{
      socket.to(socket.username).emit("isOnline", {username, isOnline: false});
    }
  })

  socket.on("mehfil", (message) => {
    console.log(`Recieved message from ${socket.username}: `, message);
    sendNotification(message, 'Mehfil');
    socket.broadcast.emit("mehfil", {
      message,
      fromID: socket.id,
      fromUsername: socket.username,
    });
  });
  socket.on("guftgu", async({ message, toUsername }) => {
    console.log(
      `Recieved guftgu from ${socket.username} to ${toUsername}: `,
      message,
    );
    sendNotification(message, 'Guftgu');
    if(users[toUsername]){
    chatNamespace
      .to(toUsername)
      .emit("guftgu", { message, fromUsername: socket.username });
    } else {
      const msg = new messageModel({sender: socket.username, receiver: toUsername, message});
      await msg.save();
    }
  });
  socket.on("location", (location) => {
    console.log(`Location recieved from ${socket.username}: `, location);
    socket.broadcast.emit("location", {
      location,
      fromUsername: socket.username,
    });
  });
});

chatNamespace.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
