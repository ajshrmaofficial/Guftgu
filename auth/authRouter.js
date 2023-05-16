const express = require("express");
const { randomBytes } = require("node:crypto");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userModel = require("../schema/userSchema");
const authRouter = express.Router();
const sessionManager = require("./sessionManager");
const redisClient = sessionManager.redisClient;

async function connectMongoose() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
    console.log("connected to mongoose database");
  } catch (err) {
    console.log(err);
  }
}

connectMongoose();

authRouter.get("/isLoggedIn", async (req, res) => {
  if (req.cookies?.sessionID) {
    const result = await redisClient.exists(`sess:${req.cookies.sessionID}`);
    if (result) res.send({ isLoggedIn: true });
    else res.send({ isLoggedIn: false });
  } else {
    console.log("sessionID not present !!!");
    res.send({ isLoggedIn: false });
  }
});

authRouter.post("/login", async (req, res) => {
  const { username, passwd } = req.body;
  if (!username.length || !passwd.length) {
    res.send("missing fields !!");
    return;
  }
  const sess = req.session;
  try {
    const user = await userModel.findOne({ username: username });
    if (!user) return res.status(401).send("user not found !!!");
    if (await bcrypt.compare(passwd, user.passwd)) {
      console.log("user authenticated !!");
      const authToken = randomBytes(16).toString("hex");
      sess.username = username;
      sess.authToken = authToken;
      sess.sessionID = req.sessionID;
      console.log("created session is: " + sess.sessionID);
      res
        .cookie("sessionID", sess.sessionID, {
          httpOnly: true,
        })
        .cookie("authToken", sess.authToken, {
          httpOnly: true,
        })
        .send({ isAuthenticated: true });
    } else {
      res.statusMessage = "Incorrect Credentials !!!";
      res.status(401).send({ isAuthenticated: false });
    }
  } catch (err) {
    console.log(`Error while logging in user: ${err.message}`);
    return res.status(500).send("Error on server while logging in !!");
  }
});

authRouter.post("/register", async (req, res) => {
  const { username, passwd } = req.body;
  if (!username.length || !passwd.length) {
    res.send("missing fields !!");
    return;
  }
  const result = await userModel.isUsernameTaken(username);
  if (result) {
    res.statusMessage = "username already taken !!"
    res.sendStatus(406);
    return;
  }
  try {
    var salt = await bcrypt.genSalt();
    var hashedPwd = await bcrypt.hash(passwd, salt);
  } catch (err) {
    console.log(err);
    res.status(500).send("Some error occured at server !!");
    return;
  }
  const newUser = new userModel({ username, passwd:hashedPwd });
  try {
    await newUser.save();
    console.log("user registered");
    res.status(200).send("user registered !!");
  } catch (error) {
    console.log(`Error at registering user: ${error}`);
    res.status(500).send("Some error occured at server !!");
  }
});

authRouter.get("/logout", async (req, res) => {
  if (!req.cookies?.sessionID) return
  await redisClient.del(`sess:${req.cookies.sessionID}`);
  res
    .clearCookie("sessionID")
    .clearCookie("authToken")
    .clearCookie("sid")
    .end();
});

module.exports = authRouter;
