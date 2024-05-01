const express = require("express");
const messageModel = require("../schema/messageSchema");
const friendshipModel = require("../schema/friendShipSchema");
const { tryCatch } = require("../utils/tryCatch");
const AppError = require("../utils/appErrorClass");
const { MISSING_FIELDS, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS, USER_NOT_FOUND } = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");
const userModel = require("../schema/userSchema");

const userRouter = express.Router();

// TODO: JSON Web Token (JWT) authorization remains to be implemented
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log('bearerHeader:', bearerHeader);
    if (!bearerHeader) return res.status(401).send("Access Denied");
    const token = bearerHeader.split(' ')[1];
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
}

userRouter.use(verifyToken);

userRouter.post("/fetchUndeliveredMessages", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('fetchUndeliveredMessages request received, with verified token');
    const { receiverUsername } = req.body;
    if (!receiverUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const undeliveredMessages = await messageModel.find({ receiver: receiverUsername });
    if(undeliveredMessages.length === 0) return res.status(200).send("No undelivered messages found");
    await messageModel.deleteMany({ receiver: receiverUsername });
    res.status(200).send(undeliveredMessages);
}));

userRouter.post("/fetchFriendList", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('fetchFriendList request received, with verified token');
    const { username } = req.body;
    if (!username) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const user = await userModel.findOne({ username: username });
    if (!user) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);


    const friendList = await friendshipModel.find({ $or: [{user1: user._id}, {user2: user._id}] })
        .populate('user1', 'username name -_id')
        .populate('user2', 'username name -_id'); 
    res.status(200).send(friendList);
}));

userRouter.post("/searchUser", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('searchUser request received, with verified token');
    const { username, myUsername } = req.body;
    if (!username, !myUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const user1 = await userModel.findOne({ username: myUsername });
    const user2 = await userModel.findOne({ username: username });
    if (!user1 || !user2) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);
    
    const friend = await friendshipModel.findOne({ $or: [{user1: user1._id, user2: user2._id}, {user1: user2._id, user2: user1._id}] })
        .populate('user1', 'username name -_id')
        .populate('user2', 'username name -_id'); 
    if (friend) return res.status(200).send(friend);
    else {
        const friendTemp = await userModel.findOne({ username: username }).select('username name');
        const friend = {user: friendTemp.username, name: friendTemp.name, status: 'notFriend'};
        return res.status(200).send(friend);
    }
}));

userRouter.post("/addFriend", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('addFriend request received, with verified token');
    const { username, friendUsername } = req.body;
    if (!username || !friendUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const user1 = await userModel.findOne({ username: username });
    const user2 = await userModel.findOne({ username: friendUsername });
    if (!user1 || !user2) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);

    const friendship = new friendshipModel({ user1: user1._id, user2: user2._id });
    await friendship.save();
    res.status(200).send("Friend added successfully");
}));

userRouter.post("/acceptFriendRequest", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('acceptFriendRequest request received, with verified token');
    const { username, friendUsername } = req.body;
    if (!username || !friendUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const user2 = await userModel.findOne({ username: username });
    const user1 = await userModel.findOne({ username: friendUsername });
    if (!user1 || !user2) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);

    const friendship = await friendshipModel.findOne({ user1: user1._id, user2: user2._id });
    friendship.status = 'accepted';
    await friendship.save();
    res.status(200).send("Friend request accepted successfully");
}));

module.exports = userRouter;
