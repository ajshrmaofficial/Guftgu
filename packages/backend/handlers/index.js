const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const socketHandler = require('./socketHandler')

module.exports = {
    authRouter,
    userRouter,
    socketHandler
};
