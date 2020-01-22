const mongoose = require('mongoose');
const schema = mongoose.Schema;

const teamMemberSchema = new schema({
    bitotsavId: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const registeredEventSchema = new schema({
    eventId: {
        type: Number,
        required: true
    },
    eventLeaderBitotsavId: {
        type: Number,
        required: true 
    }
});

const notificationSchema = new schema({
    message: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});


const teamSchema = new schema({
    teamName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    teamId: {
        type: Number,
        required: true,
        unique: true
    },
    teamSize: {
        type: Number,
        required: true
    },
    teamMembers: {
        type: [teamMemberSchema],
        default: []
    },
    eventsRegistered: {
        type: [registeredEventSchema],
        default: []
    },
    points: {
        type: Number,
        default: 0
    },
    leaderId: {
        type: String,
        required: true
    },
    leaderName: {
        type: String
    },
    leaderPhoneNo: {
        type: String
    },
    teamVerified: {
        type: Boolean,
        default: false
    },
    teamNotifications: {
        type: [notificationSchema],
        default: []
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

const teamModel = mongoose.model('teams', teamSchema);
module.exports = teamModel;