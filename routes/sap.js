const express = require('express');
const router = express.Router();
const studentAmbassador = require('../models/studentAmbassador');
const sapIdCounter = require('../models/sapIdCounter');


router.post('/register', async (req, res) => {

    console.log(req.body);

    let name = req.body.name;
    let email = req.body.email;
    let college = req.body.college;
    let phone = req.body.phone;
    let ans1 = req.body.ans1;
    let ans2 = req.body.ans2;
    let ans3 = req.body.ans3;
    let ans4 = req.body.ans4;
    let ans5 = req.body.ans5;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();



    //validation




    try {
        //create new student ambassador document
        const newStudentAmbassador = new studentAmbassador({
            name: name,
            email: email,
            phone: phone,
            college: college,
            otp: otp,
            ans1: ans1,
            ans2: ans2,
            ans3: ans3,
            ans4: ans4,
            ans5: ans5
        });

        const newSAPDoc = await newStudentAmbassador.save();

        return res.json({status: 200, message: "Registered successfully!" ,user: newSAPDoc});
    }

    catch(e){
        return res.json({status: 500, message: "Server error!"});
    }
});




router.post('/verify', async(req, res)=>{

    const otp = req.body.otp;
    const email = req.body.email;
    //can use phone otp also alternatively

    try{
        let ambassador = await studentAmbassador.findOne({email: email});
        if(ambassador.otp === otp){
            const sapId = await sapIdCounter.findOne({id: "sapIdCounter"});
            const currentCount = sapId.counter;
            const newCount = sapId.counter + 1;
            let counter = await sapIdCounter.findOneAndUpdate({id: "sapIdCounter"},{counter: newCount});
            let studAmb = await studentAmbassador.findOneAndUpdate({email: email},{sapId: currentCount});
            return res.json({status: 200, sapId: newCount, message: "Successfully verified!"});
        }
        else{
            return res.json({status: 401, message: "Invalid OTP!!"});
        }
    }
    catch(e){
        return res.json({status: 500, message: "Server error!!"});
    }
});


module.exports = router;