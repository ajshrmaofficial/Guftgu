const express = require("express");
// const { randomBytes } = require("node:crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {userModel} = require("../schema");
const authRouter = express.Router();
// const sessionManager = require("./sessionManager");
const {errorHandlerMiddleware} = require("../utils");
const { tryCatch } = require("../utils");
const { USER_NOT_FOUND, MISSING_FIELDS, INVALID_CREDENTIALS, USERNAME_TAKEN } = require("../utils/errorCodes");
const {AppError} = require("../utils");
// const redisClient = sessionManager.redisClient;
const jwt = require("jsonwebtoken");

// async function connectMongoose() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       dbName: "userDB",
//       maxPoolSize: 5,
//       minPoolSize: 1,
//       maxIdleTimeMS: 10000,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//       family: 4,
//       useNewUrlParser: true,
//     });
//     console.log("connected to mongoose database");
//   } catch (err) {
//     console.error("MongoDB connection error: ",err);
//     process.exit(1);
//   }
// }

// connectMongoose();

// authRouter.get("/isLoggedIn", async (req, res) => {
//   if (req.cookies?.sessionID) {
//     const result = await redisClient.exists(`sess:${req.cookies.sessionID}`);
//     if (result) res.send({ isLoggedIn: true });
//     else res.send({ isLoggedIn: false });
//   } else {
//     console.log("sessionID not present !!!");
//     res.send({ isLoggedIn: false });
//   }
// });

authRouter.post("/register", tryCatch(async (req, res) => {
  const { username, passwd, name } = req.body;
  if (!username || !passwd || !name) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);
  console.log('registering user...', username, passwd, name)
  const result = await userModel.isUsernameTaken(username);
  if (result) throw new AppError(USERNAME_TAKEN.errorCode, USERNAME_TAKEN.message, USERNAME_TAKEN.statusCode);

  var salt = await bcrypt.genSalt();
  var hashedPwd = await bcrypt.hash(passwd, salt);
  const newUser = new userModel({ username: username, passwd: hashedPwd, name: name });
  
  const userSaveResult = await newUser.save();
  if(!userSaveResult) throw new AppError(INTERNAL_SERVER_ERROR.errorCode, INTERNAL_SERVER_ERROR.message, INTERNAL_SERVER_ERROR.statusCode);
  
  console.log("user registered");
  res.status(201).send("User registered successfully") // TODO: change this to error code

}));

authRouter.post("/login", tryCatch(async (req, res)=>{
  const { username, passwd, fcmToken } = req.body;
     if (!username || !passwd) {
    throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode)
  }
  // const sess = req.session;
    const user = await userModel.findOne({ username: username });
    
    if (!user) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode)
    console.log('login api hit...')
    if (await bcrypt.compare(passwd, user.passwd)) {
      console.log("user authenticated !!");
      if(fcmToken) {
        user.fcmToken = fcmToken;
        await user.save();
      }
      // const authToken = randomBytes(16).toString("hex");
      // sess.username = username;
      // sess.authToken = authToken;
      // sess.sessionID = req.sessionID;
      // console.log("created session is: " + sess.sessionID);
      // res
      //   .status(200)  // TODO: change this to error code
      //   .cookie("sessionID", sess.sessionID, {
      //     httpOnly: true,
      //   })
      //   .cookie("authToken", sess.authToken, {
      //     httpOnly: true,
      //   })
      //   .end();
      const authToken = jwt.sign({username}, process.env.JWT_SECRET);
      console.log('sending data to client...', user.name)
      res.status(200).json({authToken, name: user.name});
    } else throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode)
}));

authRouter.get("/logout", async (req, res) => {
  if (!req.cookies?.sessionID) return
  await redisClient.del(`sess:${req.cookies.sessionID}`);
  res
    .clearCookie("sessionID")
    .clearCookie("authToken")
    .clearCookie("sid")
    .end();
});

authRouter.use(errorHandlerMiddleware)

module.exports = authRouter;
