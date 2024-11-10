const mongoose = require("mongoose");
const friendshipModel = require('./friendShipSchema');
const messageModel = require('./messageSchema')
const userModel = require('./userSchema')

async function connectMongoose() {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: "userDB",
        maxPoolSize: 5,
        minPoolSize: 1,
        maxIdleTimeMS: 10000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        useNewUrlParser: true,
      });
      console.log("connected to mongoose database");
    } catch (err) {
      console.error("MongoDB connection error: ",err);
      process.exit(1);
    }
}

module.exports = {
    friendshipModel,
    messageModel,
    userModel,
    connectMongoose
};
