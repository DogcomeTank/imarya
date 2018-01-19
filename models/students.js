const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const StudentSchema = new Schema({
    userName: String,
    firstName: String,
    lastName: String,
    email: String,
})

StudentSchema.plugin(passportLocalMongoose);

const Students = mongoose.model('Students', StudentSchema);

module.exports = Students;