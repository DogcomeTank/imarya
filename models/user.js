const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    oAuthProvider: {
        type: String,
        default: 'l',
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


const User = mongoose.model('Users', UserSchema);

module.exports = User;