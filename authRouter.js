const express = require('express')
const crypto = require('node:crypto')
const authRouter = express.Router()
const redisClient = require('./')

const user = {
  myUser: 'user',
  myPasswd: 'mypasswd'
}

authRouter.get("/isLoggedIn", async(req, res) => {
  if(req.cookies?.sessionID){
    const result = await redisClient.exists(`sess:${req.cookies.sessionID}`);
  if(result) res.send({isLoggedIn: true})
  else res.send({isLoggedIn: false})
  }
  else{
    console.log('sessionID not present !!!')
    res.send({isLoggedIn: false})
  }
});

authRouter.post("/login", (req, res) => {
  const sess = req.session;
  const { username, passwd } = req.body;
  if (username == user.myUser && passwd == user.myPasswd) {
    const auth = crypto.randomBytes(48).toString("hex");
    sess.username = username;
    sess.authToken = auth;
    sess.sessionID = req.sessionID;
    console.log('Created Session ID is: '+ sess.sessionID)
    res.cookie('sessionID', sess.sessionID, {
      httpOnly: true,
    }).cookie('authToken', sess.authToken, {
      httpOnly: true,
    }).send({isAuthenticated: true})
    res.end("success");
  } else res.status(401).json("User does not exist !!").send({isAuthenticated: false});
});

authRouter.get("/logout", async(req, res) => {
  if(req.cookies?.sessionID){
    const result = await redisClient.del(`sess:${req.cookies.sessionID}`)
    if(!result) res.json('Internal server error while logging out !!')
  }
  else{
    res.json('Requested invalid logout !!')
  }
  res.clearCookie('sessionID').clearCookie('authToken').clearCookie('connect.sid').send({isLoggedIn: false})
});

module.exports = authRouter