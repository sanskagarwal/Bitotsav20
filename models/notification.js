const mongoose = require('mongoose');
const schema = mongoose.Schema;

const notificationSchema = new schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const notificationModel = mongoose.model("notifications", notificationSchema);
module.exports = notificationModel;