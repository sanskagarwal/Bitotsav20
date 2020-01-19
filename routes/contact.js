const express = require('express');
const contactModel = require('../models/contact');
const validateCapcha = require('../utils/validateCaptcha');
const { check, validationResult } = require('express-validator');
const router = express.Router();


router.post('/sendMessage', [check('email').isEmail(), check('message').isLength({ min: 15, max: 100 })],

    function (req, res, next) {

        const name = req.body.name.toString().trim();
        const email = req.body.email.toString().trim();
        const subject = req.body.subject.toString().trim();
        const message = req.body.message.toString().trim();


        if (name === "" || email === "" || subject === "" || message === "") {
            return res.json({
                status: 400,
                message: "Missing required fields!"
            });
        }

        if (!name) {
            return res.json({
                status: 400,
                message: "Name is required!"
            });
        }

        if (!email) {
            return res.json({
                status: 400,
                message: "Email is required!"
            });
        }

        if (!subject) {
            return res.json({
                status: 400,
                message: "Subject is required!"
            });
        }

        if (!message) {
            return res.json({
                status: 400,
                message: "Message is required!"
            });
        }

        next();

    },

    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (errors.errors[0].param == "email") {
                return res.json({ status: 422, message: "Invalid email" });
            }
            else {
                return res.json({
                    status: 422,
                    message: "Message should have minimum 15 and max 100 characters!"
                });
            }
        }
        next();
    },


    function (req, res, next) {
        const name = req.body.name.toString().trim();
        const email = req.body.email.toString().trim();
        const subject = req.body.subject.toString().trim();
        const message = req.body.message.toString().trim();
        const contactMessage = new contactModel({
            name: name,
            email: email,
            subject: subject,
            message: message
        });
        contactMessage.save();
        res.json({ status: 200, message: "Message sent successfully :)" });

    });


module.exports = router;