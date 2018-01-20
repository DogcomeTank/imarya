const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    userName: String,
    firstName: String,
    lastName: String,
    email: String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;