
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    location: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const Location = mongoose.model('Location',LocationSchema);

module.exports = Location;
