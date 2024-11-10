const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        index: true
    },
    receiver: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800
    }
});

messageSchema.index({sender: 1, receiver: 1});

const messageModel = mongoose.model('message', messageSchema)

module.exports = messageModel
