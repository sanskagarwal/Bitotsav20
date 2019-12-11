const mongoose = require('mongoose');

const sapIdCounterSchema = new mongoose.Schema({
    counter:{
        type: Number,
        default: 2000001
    },
    id:{
        type: String,
        default: "sapIdCounter"
    }
});

const sapIdCounter = mongoose.model('sapIdCounters', sapIdCounterSchema);

module.exports = sapIdCounter;