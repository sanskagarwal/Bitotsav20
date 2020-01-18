const mongoose = require('mongoose');
const schema = mongoose.Schema;

const coreTeamSchema = new schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    team: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    fbProfile: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = mongoose.model("coreTeam", coreTeamSchema);