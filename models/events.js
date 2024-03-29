const mongoose = require('mongoose');
const schema = mongoose.Schema;

const eventWinnerSchema = new schema({
    position: {
        type: Number,
        required: true
    },
    eventLeaderBitotsavId: {
        type: Number,
        required: true
    },
    eventLeaderName: {
        type: String,
        required: true
    },
    teamId: {
        type: Number,
        default: null
    },
    dummy4: {
        type: String,
        default: null
    }
});

const eventSchema = new schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        lowercase: true,
        required: true
    },
    eventCategory: {
        type: String,
        lowercase: true,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    "faculty advisors": {
        type: String,
        // required: true
    },
    club: {
        type: String,
        // required: true
    },
    points: {
        type: String,
        required: true
        // default: null
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    rulesAndRegulations: {
        type: String,
        trim: true,
        required: true
    },
    contactInformation: {
        type: String,
        trim: true,
        required: true
    },
    "resources required": {
        type: String,
        // required: true
    },
    imageName: {
        type: String,
        required: true
    },
    individual: {
        type: Number,
        required: true
    },
    group: {
        type: Number,
        default: 0
    },
    eventWinners: {
        type: [eventWinnerSchema],
        default: []
    },
    minParticipants: {
        type: Number,
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true
    },
    cashPrize: {
        type: String,
        default: null
    },
    dummy1: {
        type: String,
        default: null
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

const eventModel = mongoose.model("events", eventSchema);
module.exports = eventModel;