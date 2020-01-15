const mongoose = require('mongoose');
const schema = mongoose.Schema;

const subTeamMemberSchema = new schema({
    bitotsavId: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const registeredEventSchema = new schema({
    eventId: {
        type: Number,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    eventLeaderBitotsavId: {
        type: Number,
        required: true 
    },
    members: {
        type: [subTeamMemberSchema],
        default: []
    }
});

const userSchema = new schema({
    name: {
        type: String
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
    mobileOTP: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    bitotsavId: {
        type: Number,
        default: null
    },
    teamMongoId: {
        type: String,
        default: null
    },
    isTeamLeader: {
        type: Boolean,
        default: false
    },
    soloEventsRegistered: {
        type: [registeredEventSchema],
        default: []
    },
    teamEventsRegistered: {
        type: [registeredEventSchema],
        default: []
    },
    dummy1: {
        type: String,
        defaut: null
    },
    dummy2: {
        type: String,
        default: null
    },
    dummy3: {
        type: String,
        default: null
    }
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;