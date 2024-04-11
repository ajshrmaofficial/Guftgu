const express = require("express");
const messageModel = require("../schema/messageSchema");
const friendshipModel = require("../schema/friendShipSchema");
const { tryCatch } = require("../utils/tryCatch");
const AppError = require("../utils/appErrorClass");
const { MISSING_FIELDS, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS } = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");

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

userRouter.post("fetchUndeliveredMessages", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('fetchUndeliveredMessages request received, with verified token');
    const { receiverUsername } = req.body;
    if (!receiverUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const undeliveredMessages = await messageModel.find({ receiver: receiverUsername });
    await messageModel.deleteMany({ receiver: receiverUsername });
    res.status(200).send(undeliveredMessages);
}));

userRouter.post("fetchFriendList", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('fetchFriendList request received, with verified token');
    const { username } = req.body;
    if (!username) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const friendList = await friendshipModel.find({ $or: [{user1: username}, {user2: username}] })
        .populate('user1', 'username name -_id')
        .populate('user2', 'username name -_id'); 
    res.status(200).send(friendList);
}));

userRouter.post("searchUser", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('searchUser request received, with verified token');
    const { username } = req.body;
    if (!username) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const user = await userModel.findOne({ username: username }).select('-passwd');
    if (!user) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);
    res.status(200).send(user);
}));

userRouter.post("addFriend", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('addFriend request received, with verified token');
    const { username, friendUsername } = req.body;
    if (!username || !friendUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const friendship = new friendshipModel({ user1: username, user2: friendUsername });
    await friendship.save();
    res.status(200).send("Friend added successfully");
}));

userRouter.post("acceptFriendRequest", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('acceptFriendRequest request received, with verified token');
    const { username, friendUsername } = req.body;
    if (!username || !friendUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const friendship = await friendshipModel.findOne({ user1: friendUsername, user2: username });
    friendship.status = 'accepted';
    await friendship.save();
    res.status(200).send("Friend request accepted successfully");
}));

module.exports = userRouter;
