const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { isEmail } = require('validator');
const verifyToken = require('../utils/verifyToken');
const userModel = require('../models/user');
const teamModel = require('../models/team');
const eventModel = require('../models/events');
const TeamIdCounter = require('../models/teamIdCounter');


//for all dashbaord routes -> req.userId contains user mongo id
//1.getProfile 
//  if teamMongo Id -> get team details and send with team events registered
//  else send solo events registered
router.get('/getProfile', verifyToken, async (req, res) => {
    try {
        const mongoId = req.userId;
        const rawUser = await userModel.findById(mongoId);
        if (!rawUser) {
            return res.json({ status: 400, message: "User not found" });
        }

        if (!rawUser.teamMongoId) {
            let user = {
                name: rawUser.name,
                email: rawUser.email,
                phoneNo: rawUser.phoneNo,
                gender: rawUser.gender,
                clgName: rawUser.clgName,
                clgCity: rawUser.clgCity,
                clgState: rawUser.clgState,
                clgId: rawUser.clgId,
                isTeamLeader: rawUser.isTeamLeader,
                bitotsavId: rawUser.bitotsavId,
                soloEventsRegistered: rawUser.soloEventsRegistered
            };

            return res.json({ status: 200, user: user, isInTeam: false });
        }

        // User is in a team
        const teamMongoId = rawUser.teamMongoId;
        const team = await teamModel.findById(teamMongoId);

        if (!team) { // Not possible, but still adds a bit of protection
            return res.json({ status: 400, message: "Malacious user" });
        }

        let user = {
            name: rawUser.name,
            email: rawUser.email,
            phoneNo: rawUser.phoneNo,
            gender: rawUser.gender,
            clgName: rawUser.clgName,
            clgCity: rawUser.clgCity,
            clgState: rawUser.clgState,
            clgId: rawUser.clgId,
            isTeamLeader: rawUser.isTeamLeader,
            bitotsavId: rawUser.bitotsavId,
            teamEventsRegistered: rawUser.teamEventsRegistered
        };

        let teamD = {
            teamName: team.teamName,
            teamSize: team.teamSize,
            teamId: team.teamId,
            teamMembers: team.teamMembers
        }

        return res.json({ status: 200, user: user, team: teamD, isInTeam: true });
    }
    catch (e) {
        return res.json({ status: 500, message: "Internal server error." });
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
router.post('/register', verifyToken, async (req, res) => {
    try {
        const mongoId = req.userId;
        const rawUser = await userModel.findById(mongoId);
        if (!rawUser) {
            return res.json({ status: 400, message: "User not found" });
        }

        const eventId = req.body.eventId;
        if (!eventId || (eventId < 0) || (eventId > 40)) {
            return res.json({ status: 400, message: "Invalid Event Id" });
        }

        //Event Name will not be in body
        const eventName = await eventModel.findOne({ id: eventId }, 'name');

        const participantsObjectArray = [...(req.body.participants)];
        //participants' bitotsavId and email is provided as an array of objects
        const participantsSize = participantsObjectArray.length;

        if (rawUser.teamMongoId) {
            const teamMongoId = rawUser.teamMongoId;
            const team = await teamModel.findById(teamMongoId);

            //check1....the team must not be registered in this event already
            const eventsReg = team.eventsRegistered;
            const eventFind = eventsReg.find((event) => event.eventId === eventId);
            if (eventFind !== undefined) { // An Object is found
                return res.json({ status: 403, message: "You team is already registered in this event!" });
            }

            //check2....the participants array must be unique objects
            const participantsSet = new Set(participantsObjectArray);
            if (participantsSet.size < participantsObjectArray.length) {
                return res.json({ status: 403, message: "Duplicate participants not allowed!" });
            }

            //check3....all the event participants must be part of the team
            const teamMembers = team.teamMembers;
            const teamSize = teamMembers.length;
            for (let i = 0; i < participantsSize; i++) {
                for (let j = 0; j < teamSize; j++) {
                    if ((participantsObjectArray[i].bitotsavId === teamMembers[j].bitotsavId) && (participantsObjectArray[i].email === teamMembers[j].email)) {
                        break;
                    }
                }
                if (j === teamSize) { // No member found
                    return res.json({ status: 403, message: `The participant with email: ${participantsObjectArray[i].email} is not a part of current team.` });
                    break;
                }
            }

            //now register for the event
            let participants = [];
            participantsObjectArray.forEach((member) => {
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
            await userModel.updateMany({ teamMongoId: teamMongoId }, { $push: { teamEventsRegistered: event } });
            await teamModel.updateOne({ _id: teamMongoId }, { $push: { eventsRegistered: { eventId: eventId, eventLeaderBitotsavId: rawUser.bitotsavId } } });
            return res.json({ status: 200, message: `Successfully Registered, ${rawUser.name} is the event leader for the event ${eventName}` });
        }

        else {

            //check1....the participants array must be unique objects
            const participantsSet = new Set(participantsObjectArray);
            if (participantsSet.size < participantsObjectArray.length) {
                return res.json({ status: 403, message: "Duplicate participants not allowed!!" });
            }

            //check2....participants credentials must be correct and none of the participants should already be in any sub-team registered for that event
            for (let i = 0; i < participantsSize; i++) {
                let indivParticipant = await userModel.findOne({ email: participantsObjectArray[i].email, bitotsavId: participantsObjectArray[i].bitotsavId, teamMongoId: null });
                if (indivParticipant) {
                    if (indivParticipant.soloEventsRegistered.find((event) => event.eventId === eventId)) {
                        return res.json({ status: 403, message: `Participant (${indivParticipant.name}) is already registered in this event!!` });
                    }
                    continue;
                }
                return res.json({ status: 403, message: `Invalid credentials of the participant with email: ${participantsObjectArray[i].email}, Ensure the participant is not already in a team.` });
            }


            //now register for the event
            let soloParticipants = [];
            let soloParticipantsEmail = [];
            participantsObjectArray.forEach((member) => {
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
            await userModel.updateMany({ email: { $in: soloParticipantsEmail } }, { $push: { soloEventsRegistered: event } });
            return res.json({ status: 200, message: `Congrats ${rawUser.name}!!As the event leader you have successfully registered for ${eventName} along with your friends!!` });
        }
    }
    catch (e) {
        return res.json({ status: 500, message: "Internal server error!!" });
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
router.post('/deregister', verifyToken, async (req, res) => {
    try {
        const userMongoId = req.userId;
        const rawUser = await userModel.findById(userMongoId);
        if (!rawUser) {
            return res.json({ status: 400, message: "User not found!!" });
        }

        const eventId = req.body.eventId;
        if (!eventId || (eventId < 0) || (eventId > 40)) {
            return res.json({ status: 400, message: "Invalid Event Id!!" });
        }

        //Event Name will not be in body
        const eventName = await eventModel.findOne({ id: eventId }, 'name');

        const teamMongoId = rawUser.teamMongoId;
        const userBitotsavId = rawUser.bitotsavId;
        if (teamMongoId) {
            const teamEventsReg = rawUser.teamEventsRegistered;

            //check1....user must be registered in the team event specified by eventId
            const event = teamEventsReg.find((eventObj) => eventObj.eventId === eventId);
            if (!event) {
                return res.json({ status: 403, message: "Can't deregister if you are not registered in the first place!!" });
            }

            //check2....user must be the event leader for that event
            const leaderBitotsavId = event.eventLeaderBitotsavId;
            if (userBitotsavId !== leaderBitotsavId) {
                return res.json({ status: 403, message: "Only event leader is allowed to deregister the team from any event!!" });
            }

            //now deregister from the event
            await userModel.updateMany({ teamMongoId: teamMongoId }, { $pull: { teamEventsRegistered: { eventId: eventId } } });
            await teamModel.updateOne({ _id: teamMongoId }, { $pull: { eventsRegistered: { eventId: eventId } } });
            return res.json({ status: 200, message: `Successfully deregistered from the event: ${eventName}` });
        }
        else {
            const soloEventsReg = rawUser.soloEventsRegistered;

            //check1....user must be registered in the solo event specified by eventId
            const event = soloEventsReg.find((eventObj) => eventObj.eventId === eventId);
            if (!event) {
                return res.json({ status: 403, message: "Can't deregister if you are not registered in the first place!!" });
            }

            //check2....user must be the event leader for that event
            const leaderBitotsavId = event.eventLeaderBitotsavId;
            if (userBitotsavId !== leaderBitotsavId) {
                return res.json({ status: 403, message: "Only event leader is allowed to deregister the team from any event!!" });
            }

            //now deregister from the event
            let soloParticipantsEmail = [];
            let soloParticipants = event.members;
            soloParticipants.forEach((participant) => {
                soloParticipantsEmail.push(participant.email);
            });


            await userModel.updateMany({ email: { $in: soloParticipantsEmail } }, { $pull: { soloEventsRegistered: { eventId: eventId } } });
            return res.json({ status: 200, message: `Successfully deregistered from the event: ${eventName}` });
        }
    }
    catch (e) {
        return res.json({ status: 500, message: "Internal server error!!" });
    }
});





























router.post(
    "/updatePassword",
    [check("password").isLength({ min: 6, max: 15 })],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                status: 422,
                message: "Invalid password, password length must be 6-15."
            });
        }
        if (req.body.password !== req.body.confPassword) {
            return res.json({ status: 400, message: "Password does not match" });
        }
        next();
    }, verifyToken,
    async (req, res) => {
        try {
            const rawUser = await userModel.findById(req.userId);
            if (!rawUser) {
                return res.json({ status: 400, message: "User not found" });
            }
            bcrypt.hash(req.body.password, 8, (err, hashedPassword) => {
                if (err) {
                    return res.json({ status: 500, message: "Internal Server Error" });
                }
                rawUser.password = hashedPassword;
                rawUser.save((err) => {
                    if (err) {
                        return res.json({ status: 500, message: "Server Error" });
                    }
                    return res.json({ status: 200, message: "Password succesfully changed" });
                });
            });
        } catch (e) {
            return res.json({ status: 500, message: "Server Error" });
        }
    }
);

router.post("/teamRegister", verifyToken, (req, res, next) => {
    // Data Validation

    if (!req.body.teamName || !req.body.teamSize) {
        return res.json({
            status: 400,
            message: "Team Name and Team size is required"
        });
    }

    let memberDataInBody = req.body.membersData;

    if (!memberDataInBody || !Array.isArray(memberDataInBody)) {
        return res.json({
            status: 400,
            message: "Members Data Missing"
        });
    }

    //checking if team name has minimum 4 characters
    const teamName = req.body.teamName
        .toString()
        .trim()
        .toLowerCase();
    if (teamName.length < 4) {
        return res.json({
            status: 422,
            message: "Team Name must contain at least 4 characters!"
        });
    }

    // Checking Team Size
    let teamSize = req.body.teamSize;
    try {
        teamSize = Number(teamSize);
        if (!teamSize) {
            throw "Team Size Should be a number";
        }
        if (teamSize % 1 !== 0) {
            throw "Team Size should be a integer";
        }
    } catch (e) {
        return res.json({ status: 422, message: e });
    }

    if (teamSize > 8 || teamSize < 6) {
        return res.json({
            status: 422,
            message: "Team Size Should be between 6 and 8 members"
        });
    }

    if (teamSize !== req.body.membersData.length) {
        return res.json({
            status: 422,
            message: "Invalid Team Size"
        });
    }

    let membersData = [];
    for (let i = 0; i < teamSize; i++) {
        const obj = req.body.membersData[i];
        if (!obj) {
            return res.json({ status: 422, message: `Missing Data of member ${i + 1}` });
        }
        let bitotsavId = obj.bitotsavId, emailId = obj.email;
        if (!bitotsavId || !emailId) {
            return res.json({ status: 422, message: `Missing Data of member ${i + 1}` });
        }
        try {
            bitotsavId = Number(bitotsavId);
            if (!bitotsavId) {
                throw `Invalid credentials of member ${i + 1}`;
            }
            if (bitotsavId % 1 !== 0) {
                throw `Invalid credentials of member ${i + 1}`;
            }
            emailId = emailId.toString().trim();
            if (!isEmail(emailId)) {
                throw `Invalid credentials of member ${i + 1}`;
            }
        } catch (e) {
            return res.json({ status: 422, message: e });
        }
        obj.bitotsavId = bitotsavId;
        obj.email = emailId;
        membersData.push(obj);
    }

    //check all bitotsav ids are unique
    let bitotsavIdSet = new Set();
    for (let i = 0; i < teamSize; i++) {
        bitotsavIdSet.add(membersData[i].bitotsavId);
    }
    if (bitotsavIdSet.size < teamSize) {
        return res.json({
            status: 415,
            message: "Ensure that unique pantheon ids are used for team regsitration!"
        });
    }

    //check all email ids are unique
    let emailSet = new Set();
    for (let i = 0; i < teamSize; i++) {
        emailSet.add(membersData[i].email);
    }
    if (emailSet.size < teamSize) {
        return res.json({
            status: 415,
            message: "Ensure that unique email ids are used for team regsitration!"
        });
    }

    async function teamRegister() {
        try {
            const userId = req.userId;
            let user = await userModel.findById(userId);
            if (!user) {
                return res.json({ status: 400, message: "User not found" });
            }

            // Check Same Team
            const foundTeam = await teamModel.findOne({ teamName: teamName });
            if (foundTeam) {
                return res.json({ status: 415, message: "Team name already used!" });
            }

            //check if any member is already in some team and email and bitotsavIds are in sync
            for (let i = 0; i < teamSize; i++) {
                let email = membersData[i].email,
                    bitotsavId = membersData[i].bitotsavId;
                const foundUser = await userModel.findOne({ email: email });
                if (!foundUser) {
                    return res.json({
                        status: 415,
                        message: `wrong credentials of member ${i + 1}`
                    });
                } else if (!foundUser.bitotsavId || !foundUser.email) {
                    return res.json({
                        status: 415,
                        message: `Member ${i + 1} not verified`
                    });
                } else if (
                    foundUser.email !== email ||
                    foundUser.bitotsavId !== bitotsavId
                ) {
                    return res.json({
                        status: 415,
                        message: `Wrong credentials of member ${i + 1}`
                    });
                } else if (foundUser.teamMongoId) {
                    return res.json({
                        status: 415,
                        message: `Member ${i +
                            1} is already registered in some another team!`
                    });
                } else if (Array.isArray(foundUser.soloEventsRegistered) && foundUser.soloEventsRegistered.length > 0) {
                    return res.json({
                        status: 415, message: `Member ${i + 1} is registered in some events, de-regsiter his/her existing events and try again.`
                    });
                }
                membersData[i].name = foundUser.name;
            }

            let newTeam = new teamModel({ teamName, teamSize });
            newTeam.leaderId = userId;
            newTeam.leaderName = user.name;
            newTeam.leaderPhoneNo = user.phoneNo;
            newTeam.teamMembers = membersData;

            //increment team id couter
            let teamCount = -1;
            const teamCounter = await TeamIdCounter.findOne({ find: "teamId" });
            if (!teamCounter) {
                return res.json({ status: 500, message: "Error on the server!" });
            }
            teamCount = teamCounter.count + 1;
            teamCounter.count = teamCount;
            const updatedCounter = await teamCounter.save();
            newTeam.teamId = teamCount;

            const room = await newTeam.save();
            let { _id } = room;

            //setting member1 as leader and its teamMongoId
            user.isTeamLeader = true;
            user.teamMongoId = _id;
            const saveTeamLeader = await user.save();

            // Saving all members teamMongoId
            let bitotsavIdsInTeam = [];
            for (let i = 0; i < teamSize; i++) {
                bitotsavIdsInTeam.push(membersData[i].bitotsavId);
            }
            const modifiedTeams = await userModel.updateMany(
                { bitotsavId: { $in: bitotsavIdsInTeam } },
                { $set: { teamMongoId: _id } }
            );
            res.json({ status: 200, message: "Team registration complete!" });
            newTeam.teamNotifications.push({ message: `${user.name} registered the team ${newTeam.teamName}  with ${newTeam.teamSize} members.` });
            await newTeam.save();
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, message: "Internal server error" });
        }
    }
    teamRegister();
});

module.exports = router;