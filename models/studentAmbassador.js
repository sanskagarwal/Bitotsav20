const mongoose = require('mongoose');

const studentAmbassadorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    college:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    sapId:{
        type: Number
    },
    otp:{
        type:String
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    ans1:{
        type: String,
        required: true
    },
    ans2:{
        type: String,
        required: true
    },
    ans3:{
        type: String,
        required: true
    },
    ans4:{
        type: String,
        required: true
    },
    ans5:{
        type: String,
        required: true
    }
});

const StudentAmbassador = mongoose.model('studentAmbassadors', studentAmbassadorSchema);

module.exports = StudentAmbassador;