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
        required: true
    },
    eventCategory: {
        type: String,
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
        required: true
    },
    club: {
        type: String,
        required: true
    },
    points: {
        type: String,
        default: null
    },
    description: {
        type: String,
        required: true
    },
    "rules and regulations": {
        type: String,
        required: true
    },
    "contact information": {
        type: String,
        required: true
    },
    "resources required": {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        default: null
    },
    individual: {
        type: String,
        required: true
    },
    eventWinners: {
        type: [eventWinnerSchema],
        default: []
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