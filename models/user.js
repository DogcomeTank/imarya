const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({
    username: {
        type: String,
        default: null
    },
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    displayName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: String,
    mailName: {
        type: String,
        default: null
    },
    streetAndNumber: {
        type: String,
        default: null,
    },
    apartmentNumber:{
        type: String,
        default: null
    },
    city:{
        type: String,
        default: null
    },
    province: {
        type: String,
        default: null
    },
    postalCode: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    oAuthId: {
        type: String,
        default: null
    },
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