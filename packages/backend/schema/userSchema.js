const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    passwd: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    fcmToken: {
        type: String,
        default: null,
        sparse: true
    }
}, {timestamps: true})

userSchema.statics.isUsernameTaken = async function(username){
    if(!username) throw new Error('Username is required')
    try{
        const result = await this.exists({'username': username})
        if(result) return true;
        return false
    }
    catch(err){
        throw new Error(`Error while checking if username is taken: ${err.message}`)
    }
}

const userModel = mongoose.model('users', userSchema)

module.exports = userModel
