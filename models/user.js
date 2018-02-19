const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    displayName: String,
    email: String,
    password: String,
    streetAndNumber: String,
    apartmentNumber:String,
    city:String,
    province: String,
    postalCode: String,
    phone: String,
    oAuthId: String,
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

UserSchema.plugin(findOrCreate);

const User = mongoose.model('Users', UserSchema);

module.exports = User;