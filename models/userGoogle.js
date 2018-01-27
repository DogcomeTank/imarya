const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    oAuthProvider: String
})

const googleUser = mongoose.model('users',userSchema);

module.exports = googleUser;