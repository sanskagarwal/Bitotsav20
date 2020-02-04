const mongoose = require('mongoose');
const schema = mongoose.Schema;

const announcementSchema = new schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const announcementModel = mongoose.model("announcements", announcementSchema);
module.exports = announcementModel;