const mongoose = require('mongoose');
const schema = mongoose.Schema

const eventSchema = new schema({

    eventId: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    club: {
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
    teamSize: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coordinators: {
        type: String,
        required: true
    },
    points: {
        type: String,
        require:true
    },
    category: {
        type: String,
        required:true
    }


});

module.exports = mongoose.model("events", eventSchema);