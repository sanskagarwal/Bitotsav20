const express = require('express');
const router = express.Router();
const studentAmbassador = require('../models/studentAmbassador');
const sapIdCounter = require('../models/sapIdCounter');
const { validationResult } = require('express-validator');
const { validate } = require('./../utils/validation');
const sendEmail = require('./../utils/sendEmail');

router.post('/register', validate('sapUser'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.errors);
        res.json({ status: 422, msg: errors.errors[0].msg });
        return;
    }

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

        const sapUser = await studentAmbassador.findOne({ email: email });
        if (sapUser) {
            return res.json({ status: 400, message: "Email Already Regsitered." });
        }

        await newStudentAmbassador.save();
        res.json({ status: 200, msg: "Registered successfully, OTP sent to email." });

        try {
            sendEmail(`
                    <h2 align="center">Bitotsav</h2>
                    <p>
                    Hi,<br><br>
                    Your Otp for SAP email verification is: ${otp}.<br><br>
                    Regards,<br>
                    Web Team<br>
                    Bitotsav'20</p>
                `,
                email
            );
        } catch (e) {
            console.log("Mail error");
            return console.log(e);
        }
    } catch (e) {
        return res.json({ status: 500, message: "Server error!" });
    }
});

router.post('/verify', validate('verifySapUser'), async (req, res) => {

    const otp = req.body.otp;
    const email = req.body.email;
    //can use phone otp also alternatively

    try {
        let ambassador = await studentAmbassador.findOne({ email: email });

        if(!ambassador) {
            return res.json({ status: 400, msg: "Bad Request!!" });
        }

        if (ambassador.otp === otp) {
            const sapId = await sapIdCounter.findOne({ id: "sapIdCounter" });
            const currentCount = sapId.counter;
            const newCount = sapId.counter + 1;
            await sapIdCounter.findOneAndUpdate({ id: "sapIdCounter" }, { counter: newCount });
            await studentAmbassador.findOneAndUpdate({ email: email }, { sapId: currentCount, isVerified: true });
            return res.json({ status: 200, msg: `Successfully verified! Your SAP id is ${newCount}, Further Details will be sent to your Email.` });
        }
        else {
            return res.json({ status: 401, msg: "Invalid OTP!!" });
        }
    }
    catch (e) {
        return res.json({ status: 500, message: "Server error!!" });
    }
});


module.exports = router;