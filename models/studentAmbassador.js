const mongoose = require('mongoose');

const studentAmbassadorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    college: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true
    },
    sapId: {
        type: Number,
        default: -1
    },
    otp: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    ans1: {
        type: String,
        required: true,
        trim: true
    },
    ans2: {
        type: String,
        required: true,
        trim: true
    },
    ans3: {
        type: String,
        required: true,
        trim: true
    },
    ans4: {
        type: String,
        required: true,
        trim: true
    },
    ans5: {
        type: String,
        required: true,
        trim: true
    },
    dummy1: {
        type: String
    }
});

const StudentAmbassador = mongoose.model('studentAmbassadors', studentAmbassadorSchema);

module.exports = StudentAmbassador;