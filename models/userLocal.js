const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('Users', UserSchema);

module.exports = User;