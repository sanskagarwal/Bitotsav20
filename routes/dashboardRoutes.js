const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const userModel = require('../models/user');
const teamModel = require('../models/team');
const {check, validationResult} = require("express-validator");


//for all dashbaord routes -> req.userId contains user mongo id
//1.getProfile 
//  if teamMongo Id -> get team details and send with team events registered
//  else send solo events registered
router.get('/getProfile', verifyToken, async(req, res)=>{
    try{
        const mongoId = req.userId;
        const rawUser = await userModel.findById(mongoId);
        if(!rawUser) {
            return res.json({status: 400, message: "User not found"});
        }

        if(!rawUser.teamMongoId) {
            let user = {...rawUser};
            delete user.password;
            delete user.emailOTP;
            delete user.mobileOTP;
            delete user.teamMongoId;
            delete user.teamEventsRegistered;
            delete user.dummy1;
            delete user.dummy2;
            delete user.dummy3;

            return res.json({status: 200, user: user, isInTeam: false});
        }

        // User is in a team
        const teamMongoId = rawUser.teamMongoId;
        const team = await teamModel.findById(teamMongoId);

        if(!team) { // Not possible, but still adds a bit of protection
            return res.json({status: 400, message: "Malacious user"});
        }

        let user = {...rawUser};
        delete user.password;
        delete user.emailOTP;
        delete user.mobileOTP;
        delete user.teamMongoId;
        delete user.soloEventsRegistered;
        delete user.dummy1;
        delete user.dummy2;
        delete user.dummy3;
        
        delete team.dummy1;
        delete team.dummy2;

        return res.json({status: 200, user: user, team: team, isInTeam: true});
    }
    catch(e){
        return res.json({status: 500, message: "Internal server error."});
    }
});

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
router.post('/register', verifyToken, async(req, res)=>{
    try{
        const mongoId = req.userId;
        const rawUser = await userModel.findById(mongoId);
        if(!rawUser) {
            return res.json({status: 400, message: "User not found"});
        }

        const eventId = req.body.eventId;
        if(!eventId || (eventId<0) || (eventId>40)) {
            return res.json({status: 400, message: "Invalid Event Id"});
        }
        //Event Name will not be in body
        // const eventName = req.body.eventName;
        const participantsObjectArray = [...(req.body.participants)];
        //participants' bitotsavId and email is provided as an array of objects
        const participantsSize = participantsObjectArray.length;

        if(rawUser.teamMongoId){
            const teamMongoId = rawUser.teamMongoId;
            const team = await teamModel.findById(teamMongoId);

            //check1....the team must not be registered in this event already
            const eventsReg = team.eventsRegistered;
            const eventFind = eventsReg.find((event)=>event.eventId===eventId);
            if(eventFind !== undefined){ // An Object is found
                return res.json({status: 403, message: "You team is already registered in this event!"});
            }
            
            //check2....the participants array must be unique objects
            const participantsSet = new Set(participantsObjectArray);
            if(participantsSet.size < participantsObjectArray.length){
                return res.json({status: 403, message: "Duplicate participants not allowed!"});
            }

            //check3....all the event participants must be part of the team
            const teamMembers = team.teamMembers;
            const teamSize = teamMembers.length;
            for(let i=0;i<participantsSize;i++){
                for(let j=0;j<teamSize;j++){
                    if((participantsObjectArray[i].bitotsavId===teamMembers[j].bitotsavId)&&(participantsObjectArray[i].email===teamMembers[j].email)){
                        break;
                    }
                }
                if(j===teamSize){ // No member found
                    return res.json({status: 403, message: `The participant with email: ${participantsObjectArray[i].email} is not a part of current team.`});
                    break;
                }
            }

            //now register for the event
            let participants = [];
            participantsObjectArray.forEach((member)=>{
                participants.push({
                    bitotsavId: member.bitotsavId,
                    email: member.email
                });
            });
            const event = {
                eventId: eventId,
                eventName: eventName,
                eventLeaderBitotsavId: rawUser.bitotsavId,
                members: participants
            };
            // Nice DB Query :)
            await userModel.updateMany({teamMongoId: teamMongoId}, {$push: {teamEventsRegistered: event}});
            await teamModel.updateOne({_id: teamMongoId}, {$push: {eventsRegistered: {eventId: eventId, eventLeaderBitotsavId: rawUser.bitotsavId}}});
            return res.json({status: 200, message: `Successfully Registered, ${rawUser.name} is the event leader for the event ${eventName}`});
        }

        else{

            //check1....the participants array must be unique objects
            const participantsSet = new Set(participantsObjectArray);
            if(participantsSet.size < participantsObjectArray.length){
                return res.json({status: 403, message: "Duplicate participants not allowed!!"});
            }

            //check2....participants credentials must be correct and none of the participants should already be in any sub-team registered for that event
            for(let i=0;i<participantsSize;i++){
                let indivParticipant = await userModel.findOne({email: participantsObjectArray[i].email, bitotsavId: participantsObjectArray[i].bitotsavId, teamMongoId: null});
                if(indivParticipant){
                    if(indivParticipant.soloEventsRegistered.find((event)=>event.eventId===eventId)) {
                        return res.json({status: 403, message: `Participant (${indivParticipant.name}) is already registered in this event!!`});
                    }
                    continue;
                }
                return res.json({status: 403, message: `Invalid credentials of the participant with email: ${participantsObjectArray[i].email}, Ensure the participant is not already in a team.`});
            }
            

            //now register for the event
            let soloParticipants = [];
            let soloParticipantsEmail = [];
            participantsObjectArray.forEach((member)=>{
                soloParticipants.push({
                    bitotsavId: member.bitotsavId,
                    email: member.email
                });
                soloParticipantsEmail.push(member.email);
            });
            const event = {
                eventId: eventId,
                eventName: eventName,
                eventLeaderBitotsavId: rawUser.bitotsavId,
                members: soloParticipants
            };
            await userModel.updateMany({email: {$in: soloParticipantsEmail}}, {$push: {soloEventsRegistered: event}});
            return res.json({status: 200, message: `Congrats ${rawUser.name}!!As the event leader you have successfully registered for ${eventName} along with your friends!!`});
        }
    }
    catch(e){
        return res.json({status: 500, message: "Internal server error!!"});
    }
});









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
        userModel.findById(id, function (err, user) {
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
        userModel.findById(id, function (err, user) {
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
);


module.exports = router;