const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    oAuthProvider: String,
    email:{
        type: String,
        unique: true,
    },
    accessLevel: {
        type:Number,
        default: 0,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const googleUser = mongoose.model('users',userSchema);

module.exports = googleUser;