const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String
    },
    gender: {
        type: Number,
    },
    clgName: {
        type: String,
        // required: true
    },
    clgCity: {
        type: String,
        // required: true
    },
    clgState: {
        type: String,
        // required: true
    },
    clgId: {
        type: String,
        // required: true
    },
    emailOTP: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    bitotsavId: {
        type: Number,
        default: -1
    },
    teamMongoId: {
        type: String,
        default: null
    },
    isTeamLeader: {
        type: Boolean,
        default: false
    },
    dummy1: {
        type: String,
        defaut: null
    },
    dummy2: {
        type: String,
        default: null
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;