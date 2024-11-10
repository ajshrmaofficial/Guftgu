const express = require("express");
const {messageModel} = require("../schema");
const {friendshipModel} = require("../schema");
const { tryCatch, errorHandlerMiddleware } = require("../utils");
const {AppError} = require("../utils");
const { MISSING_FIELDS, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS, USER_NOT_FOUND, INVALID_INPUT } = require("../utils/errorCodes");
const jwt = require("jsonwebtoken");
const {userModel} = require("../schema");

const userRouter = express.Router();

// TODO: JSON Web Token (JWT) authorization remains to be implemented
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
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

userRouter.get("/fetchUndeliveredMessages", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('fetchUndeliveredMessages request received, with verified token');
    const receiverUsername = req.user.username;
    // TODO: Have to change error codes and error messages because username is not being passed by user now..
    if (!receiverUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const undeliveredMessages = await messageModel.find({ receiver: receiverUsername });
    if(undeliveredMessages.length === 0) return res.status(200).send("No undelivered messages found");
    await messageModel.deleteMany({ receiver: receiverUsername });
    res.status(200).send(undeliveredMessages);
}));

userRouter.get("/fetchFriendList", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('fetchFriendList request received, with verified token');
    const username = req.user.username;
    // TODO: Have to change error code & error message because username is not being passed by user now..
    if (!username) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const user = await userModel.findOne({ username: username });
    if (!user) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);


    const friendList = await friendshipModel.find({ $or: [{user1: user._id}, {user2: user._id}] })
        .populate('user1', 'username name -_id')
        .populate('user2', 'username name -_id'); 
    const formattedFriendList = friendList.map(friend => {
        if(friend.user1.username === username) return {username: friend.user2.username, name: friend.user2.name, status: friend.status, party: 2};
        else return {username: friend.user1.username, name: friend.user1.name, status: friend.status, party: 1};
    });
    res.status(200).send(formattedFriendList);
}));

userRouter.get("/searchUser", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('searchUser request received, with verified token');
    const {username} = req.query;
    const currUsername = req.user.username;
    
    if (!username || !currUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);
    const user1 = await userModel.findOne({ username: currUsername });
    const user2 = await userModel.findOne({ username: username });
    if (!user1 || !user2) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);

    const friend = await friendshipModel.findOne({ $or: [{user1: user1._id, user2: user2._id}, {user1: user2._id, user2: user1._id}] })
        .populate('user1', 'username name -_id')
        .populate('user2', 'username name -_id'); 
    if (friend) {
        if(friend.user1.username === currUsername) {
            const friendInfo = {username: friend.user2.username, name: friend.user2.name, status: friend.status, party: 2};
            return res.status(200).send(friendInfo);
        } else {
            const friendInfo = {username: friend.user1.username, name: friend.user1.name, status: friend.status, party: 1};
            return res.status(200).send(friendInfo);
        }
    }
    else {
        const friendInfo = {username: user2.username, name: user2.name, status: 'notFriend', party: 0};
        return res.status(200).send(friendInfo);
    }
}));

userRouter.post("/addFriend", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('addFriend request received, with verified token');
    const { friendUsername } = req.body;
    const currUsername = req.user.username;
    if (!currUsername || !friendUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);
    if(currUsername === friendUsername) throw new AppError(INVALID_INPUT.errorCode, INVALID_INPUT.message, INVALID_INPUT.statusCode);

    const user1 = await userModel.findOne({ username: currUsername });
    const user2 = await userModel.findOne({ username: friendUsername });
    if (!user1 || !user2) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);

    const friendship = new friendshipModel({ user1: user1._id, user2: user2._id });
    await friendship.save();
    res.status(200).send("Friend request sent successfully");
}));

userRouter.post("/acceptFriendRequest", tryCatch(async (req, res) => {
    if(!req.user) throw new AppError(INVALID_CREDENTIALS.errorCode, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    console.log('acceptFriendRequest request received, with verified token');
    const { friendUsername } = req.body;
    const currUsername = req.user.username;
    if (!currUsername || !friendUsername) throw new AppError(MISSING_FIELDS.errorCode, MISSING_FIELDS.message, MISSING_FIELDS.statusCode);

    const user2 = await userModel.findOne({ username: currUsername });
    const user1 = await userModel.findOne({ username: friendUsername });
    if (!user1 || !user2) throw new AppError(USER_NOT_FOUND.errorCode, USER_NOT_FOUND.message, USER_NOT_FOUND.statusCode);

    const friendship = await friendshipModel.findOne({ user1: user1._id, user2: user2._id });
    friendship.status = 'accepted';
    await friendship.save();
    res.status(200).send("Friend request accepted successfully");
}));

userRouter.use(errorHandlerMiddleware)

module.exports = userRouter;
