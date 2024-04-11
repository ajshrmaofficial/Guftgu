const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending',
    },
});

const friendshipModel = mongoose.model('friendship', friendshipSchema)

module.exports = friendshipModel
