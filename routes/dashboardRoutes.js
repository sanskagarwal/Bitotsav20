const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const user = require('../models/user');
const { check, validationResult } = require("express-validator");

router.post('/updatePassword', [check("newPassword").isLength({ min: 6, max: 15 })],
    verifyToken,
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                status: 422,
                message: "Invalid password, password length must be greater than 5."
            })
        }
        next();
    },
    function (req, res, next) {
        const id = req.userId;
        user.findById(id, function (err, user) {
            if (err) {
                return res.json({ status: 500, message: "Internal Server Error" });
            }
            else if (!user) {
                return res.json({ status: 422, message: "No user found" });
            }
            else if (user) {
                const newPassword = req.body.newPassword;
                const confirmPassword = req.body.confirmPassword;
                if (newPassword === confirmPassword) {
                    next();
                }
                else {
                    return res.json({ status: 401, message: "Password and Confirm Password din't match" });
                }

            }
        })

    },
    function (req, res, next) {
        const id = req.userId;
        user.findById(id, function (err, user) {
            if (err) {
                return res.json({ status: 500, message: "Internal Server Error" });
            }
            else {
                const newPassword = req.body.newPassword;
                user.password = newPassword;
                user.save();
            }
        })

    }
)