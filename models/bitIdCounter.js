const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bitIdCounterSchema = new Schema({
    find: {
        type: String,
        default: 'bitotsavId'
    },
    count: {
        type: Number,
        default: 200001
    }
});

const BitIdCounter = mongoose.model('bitidcounters', bitIdCounterSchema);
module.exports = BitIdCounter;