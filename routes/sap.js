const express = require('express');
const router = express.Router();
const studentAmbassador = require('../models/studentAmbassador');
const sapIdCounter = require('../models/sapIdCounter');
const { validationResult } = require('express-validator');
const { validate } = require('./../utils/validation');
const sendEmail = require('./../utils/sendEmail');
const validateCaptcha = require('./../utils/validateCaptcha');

router.post('/register', validateCaptcha, validate('sapUser'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.errors);
        res.json({ status: 422, message: errors.errors[0].msg });
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
        res.json({ status: 200, message: "Registered successfully, OTP sent to email." });

        try {
            sendEmail('Email Verification', `
                    <h2 align="center">Bitotsav</h2>
                    <p>
                    Hi,<br><br>
                    Your OTP for SAP email verification is: ${otp}.<br><br>
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

router.post('/verify', validateCaptcha, validate('verifySapUser'), async (req, res) => {

    const otp = req.body.otp;
    const email = req.body.email;
    //can use phone otp also alternatively

    try {
        let ambassador = await studentAmbassador.findOne({ email: email });

        if (!ambassador) {
            return res.json({ status: 400, message: "Bad Request!!" });
        }

        if (ambassador.otp === otp) {
            const sapId = await sapIdCounter.findOne({ id: "sapIdCounter" });
            const currentCount = sapId.counter;
            const newCount = sapId.counter + 1;
            await sapIdCounter.findOneAndUpdate({ id: "sapIdCounter" }, { counter: newCount });
            await studentAmbassador.findOneAndUpdate({ email: email }, { sapId: currentCount, isVerified: true });
            res.json({ status: 200, message: `Successfully verified! Your SAP id is SP-${currentCount}, Further Details will be sent to your Email.` });

            try {
                sendEmail('SAP Instructions', `
                    <h2 align="center">Bitotsav</h2>
                    <p>
                    Hi,<br><br>
                    Team Bitotsav welcomes you on-board with great zeal and enthusiasm.
                    Your SAP ID is <b>BITOTSAV/SAP/${currentCount}</b>. Kindly note this for future references.<br><br>
                    Below mentioned, are some of the many incentives for a Student Ambassador:<br><ul>
                    <li>The SAP gets an official certificate from BIT Mesra, Ranchi.</li>
                    <li>The SAP is given benefits in the registration fee and accommodation charges which is charged to every other participant coming at Bitotsav’20.</li>
                    <li>The SAP gets many goodies like Bitotsav’20 t-shirts, movie-tickets, gift coupons etc.</li>
                    <li>The SAP will get free registration and accommodation on successful registration of more than 20 people and 50% discount on his registration amount after successful registration of more than 10 people.</li>
                    </ul>
                    <br>
                    <u><b>Some of the Guidelines for a SAP are:</b></u><br><br>
                    As a Student Ambassador you would be working in the below mentioned facets.
                    Your tasks can broadly be divided into Online Activities and Offline Activities.
                    Likes, sharing and subscribing Facebook posts, YouTube Channel and Tweets come under Online Activities. Others like providing contacts, ideas and additional efforts come under Offline Activities. <br><br>
                    <u><b>Some general points to be noted:</b></u> Minimum conditions required to be officially recognized as a Student Ambassador and receive all the incentives from Bitotsav’20 includes continuous contribution in all the below mentioned sections.<br><ul>
                    <li>Each Ambassador on selection will be given a unique Ambassador’s id.</li>
                    <li>A college can have multiple Ambassadors.</li>
                    <li>The registrations will only be counted if the participants register with the Ambassador’s id.</li>
                    <li>Sharing and liking every post from the Bitotsav Facebook page. It must be noted that posts must be shared with ‘Everyone’ or with ‘Friends of Friends’ on the timeline.</li>
                    <li>Regular monitoring is done and for each share you fetch some points.</li>
                    <li>Every post shared should include #bitotsav_20, #carnival_of_conundrums & #yourSAPID. Also,sharing, promoting and increasing subscription of “Bitotsav Official” YouTube channel is compulsory.</li>
                    <li>Promote the Bitotsav Twitter Handle and Instagram Profile.</li>
                    <li>There is also an award for Bitosav’20 Shining Campus Ambassador which has additional special incentives like getting clicked with the night Artists, Winner’s picture to be announced and Displayed from the Bitotsav Stage during the nights, goodies etc.</li>
                    <li>Anyone found violating the guidelines or defaming Bitotsav in any way possible would bebanned from this program.</li>
                    </ul>
                    <br>
                    It is recommended to get connected with the members in the Contact Us page for better communication. Please follow the link below to join the WhatsApp group for SAP:<br>
                    <br>
                    <a href="https://chat.whatsapp.com/FpyFKV35tLyG4em2rJpXwa">https://chat.whatsapp.com/FpyFKV35tLyG4em2rJpXwa</a>
                    <br><br>
                    Regards,<br>
                    Publicity Team<br> 
                    Bitotsav '20<br>
                    If the details are incorrect or this was not done by you please reach us at info@bitotsav.in<br>
                    <br>
                    Contact :<br>
                    Nilesh : +91 8521039668<br>
                    Nipun : +91 8210712523<br>
                    `,
                    email
                );
            } catch (e) {
                console.log("Mail error");
                return console.log(e);
            }
        }
        else {
            return res.json({ status: 401, message: "Invalid OTP!!" });
        }
    }
    catch (e) {
        return res.json({ status: 500, message: "Server error!!" });
    }
});


module.exports = router;