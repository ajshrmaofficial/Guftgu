require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const { sessionMiddleware, redisClient } = require("./auth/sessionManager");
const {authRouter, socketHandler} = require("./handlers");
const {connectMongoose} = require("./schema");
const {userRouter} = require("./handlers");
// const {userModel} = require("./schema");
// const { firebase } = require("./utils/firebase");

var httpServer; // setup for https server in production
if (process.env.USING_HTTPS === "true") {
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

socketHandler(io);

const startServer = async () => {
  try {
    await connectMongoose();

    httpServer.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
    process.exit(1);
  }
};

startServer();
