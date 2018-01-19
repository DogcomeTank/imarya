const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userName: String,
    message: String,
    color: String,
})

const ChatHistory = mongoose.model('chatHistory', chatSchema);

module.exports = ChatHistory;