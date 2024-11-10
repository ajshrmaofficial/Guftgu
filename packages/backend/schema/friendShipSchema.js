const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending',
    },
}, {timestamps: true});

friendshipSchema.index({user1: 1, user2: 1}, {unique: true});

const friendshipModel = mongoose.model('friendship', friendshipSchema)

module.exports = friendshipModel
