const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const user = require('../models/user');
const {
    check,
    validationResult
} = require("express-validator");


//for all dashbaord routes -> req.userId contains user mongo id
//1.getProfile 
//  if teamMongo Id -> get team details and send with team events registered
//  else send solo events registered

//2.register events
/*
 for all checks
if teamMonmgoId = null, then check which solo evnst all members is registered in. 
                         If already registered in that events then invalid req
                         obj = {eventId: body.eventId, eventLeaderBitotsavId: user.bitId, members: []};
                         for all sub team members(noOfMembers,  each bitId,each email) push in their solo array

 else  then check which team event all members is registered in. 
                         If already registered in that events then invalid req
                         obj = {eventId: body.eventId, eventLeaderBitotsavId: user.bitId, members: []};
                         for all team members(noOfMembers,  each bitId,each email) push in their team array

*/
//3.deregister events 
/* if team MongoId = null, then check if solo event regsitered
                        if registered eventLeaderBitId = user.bitotsavId (Leader cHECk)
                            remove this event from all members soloEvent array
                        else Invalid
    else
                    then check if team event regsitered
                        if registered eventLeaderBitId = user.bitotsavId (Leader cHECk)
                            remove this event from all team members teamEvent array
                        else Invalid
*/






























router.post('/updatePassword', [check("newPassword").isLength({
        min: 6,
        max: 15
    })],
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
                return res.json({
                    status: 500,
                    message: "Internal Server Error"
                });
            } else if (!user) {
                return res.json({
                    status: 422,
                    message: "No user found"
                });
            } else if (user) {
                const newPassword = req.body.newPassword;
                const confirmPassword = req.body.confirmPassword;
                if (newPassword === confirmPassword) {
                    next();
                } else {
                    return res.json({
                        status: 401,
                        message: "Password and Confirm Password din't match"
                    });
                }

            }
        })

    },
    function (req, res, next) {
        const id = req.userId;
        user.findById(id, function (err, user) {
            if (err) {
                return res.json({
                    status: 500,
                    message: "Internal Server Error"
                });
            } else {
                const newPassword = req.body.newPassword;
                user.password = newPassword;
                user.save();
            }
        })

    }
)