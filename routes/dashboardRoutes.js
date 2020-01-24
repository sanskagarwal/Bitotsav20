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
                soloEventsRegistered: rawUser.soloEventsRegistered,
                teamEventsRegistered: rawUser.teamEventsRegistered
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
            soloEventsRegistered: rawUser.soloEventsRegistered,
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

router.post('/register', verifyToken, async (req, res) => {
    try {
        const mongoId = req.userId;
        const rawUser = await userModel.findById(mongoId);
        if (!rawUser) {
            return res.json({ status: 400, message: "User not found" });
        }

        const eventId = Number(req.body.eventId);
        if (!eventId) {
            return res.json({ status: 400, message: "Invalid Event Id" });
        }

        //Event Name will not be in body
        const eventDetail = await eventModel.findOne({ id: eventId });
        if (!eventDetail) {
            return res.json({ status: 400, message: "Invalid Event Id" });
        }
        const eventName = eventDetail.name;

        if (eventDetail.group === 1) {
            if (!rawUser.isTeamLeader) {
                return res.json({ status: 400, message: "Only Team Leader can register for flagship events." });
            }
            const teamMongoId = rawUser.teamMongoId;
            const team = await teamModel.findById(teamMongoId);

            const eventsReg = team.eventsRegistered;
            const eventFind = eventsReg.find((event) => event.eventId === eventId);
            if (eventFind !== undefined) { // An Object is found
                return res.json({ status: 403, message: "You team is already registered in this event!" });
            }

            const event = {
                eventId: eventId,
                eventName: eventName,
                eventLeaderBitotsavId: rawUser.bitotsavId,
                members: []
            };
            await userModel.updateMany({ teamMongoId: teamMongoId }, { $push: { teamEventsRegistered: event } });
            await teamModel.updateOne({ _id: teamMongoId }, {
                $push: {
                    eventsRegistered: { eventId: eventId, eventLeaderBitotsavId: rawUser.bitotsavId }, teamNotifications: {
                        message: `${rawUser.name} registered your team for the event ${eventName}`
                    }
                }
            });
            return res.json({ status: 200, message: `Successfully Registered for the flagship event ${eventName}, now mail the details of participants to the mentioned.` });
        }

        if (eventDetail.individual === 1) {
            const participantsObjectArray = [...(req.body.participants)];
            const participantsSize = participantsObjectArray.length;

            if (participantsSize < eventDetail.minParticipants || participantsSize > eventDetail.maxParticipants) {
                return res.json({ status: 403, message: `Only ${eventDetail.minParticipants}-${eventDetail.maxParticipants} participants can register` });
            }

            const participantsSet = new Set(participantsObjectArray);
            if (participantsSet.size < participantsSize) {
                return res.json({ status: 403, message: "Duplicate participants not allowed." });
            }

            for (let i = 0; i < participantsSize; i++) {
                let indivParticipant = await userModel.findOne({ email: participantsObjectArray[i].email, bitotsavId: participantsObjectArray[i].bitotsavId });
                if (indivParticipant) {
                    if (indivParticipant.soloEventsRegistered.find((event) => event.eventId === eventId)) {
                        return res.json({ status: 403, message: `Participant (${indivParticipant.name}) is already registered in this event.` });
                    }
                    continue;
                }
                return res.json({ status: 403, message: `Invalid credentials of the participant with email: ${participantsObjectArray[i].email}.` });
            }

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
            await userModel.updateMany({ email: { $in: soloParticipantsEmail } }, {
                $push: { soloEventsRegistered: event }
            });
            return res.json({ status: 200, message: `${rawUser.name} have successfully registered for ${eventName} as the event leader.` });
        }

        const participantsObjectArray = [...(req.body.participants)];
        // Participant's bitotsavId and email is provided as an array of objects
        const participantsSize = participantsObjectArray.length;

        if (rawUser.teamMongoId) {
            const teamMongoId = rawUser.teamMongoId;
            const team = await teamModel.findById(teamMongoId);

            // Check1....the team must not be registered in this event already
            const eventsReg = team.eventsRegistered;
            const eventFind = eventsReg.find((event) => event.eventId === eventId);
            if (eventFind !== undefined) { // An Object is found
                return res.json({ status: 403, message: "You team is already registered in this event!" });
            }

            // Check2....the participants array must be unique objects
            const participantsSet = new Set(participantsObjectArray);
            if (participantsSet.size < participantsObjectArray.length) {
                return res.json({ status: 403, message: "Duplicate participants not allowed!" });
            }

            // Check3....all the event participants must be part of the team
            const teamMembers = team.teamMembers;
            const teamSize = teamMembers.length;
            for (let i = 0; i < participantsSize; i++) {
                let j;
                for (j = 0; j < teamSize; j++) {
                    if ((Number(participantsObjectArray[i].bitotsavId) === teamMembers[j].bitotsavId) && (participantsObjectArray[i].email === teamMembers[j].email)) {
                        break;
                    }
                }
                if (j === teamSize) { // No member found
                    return res.json({
                        status: 403,
                        message: `The participant with email: ${participantsObjectArray[i].email} is not a part of current team.`
                    });
                }
            }

            // Register for the event
            let participants = [];
            let participantString = ""
            participantsObjectArray.forEach((member, ind) => {
                participants.push({
                    bitotsavId: Number(member.bitotsavId),
                    email: member.email
                });
                participantString += `${ind + 1}. BIT-${member.bitotsavId}\n`;
            });
            const event = {
                eventId: eventId,
                eventName: eventName,
                eventLeaderBitotsavId: rawUser.bitotsavId,
                members: participants
            };
            await userModel.updateMany({ teamMongoId: teamMongoId }, { $push: { teamEventsRegistered: event } });
            await teamModel.updateOne({ _id: teamMongoId }, {
                $push: {
                    eventsRegistered: { eventId: eventId, eventLeaderBitotsavId: rawUser.bitotsavId }, teamNotifications: {
                        message: `${rawUser.name} registered your team for the event ${eventName} with members: \n${participantString}`
                    }
                }
            });
            return res.json({ status: 200, message: `Successfully Registered, ${rawUser.name} is the event leader for the event ${eventName}` });
        } else {

            // Check1....the participants array must be unique objects
            const participantsSet = new Set(participantsObjectArray);
            if (participantsSet.size < participantsObjectArray.length) {
                return res.json({ status: 403, message: "Duplicate participants not allowed." });
            }

            // Check2....participants credentials must be correct and none of the participants should already be in any sub-team registered for that event
            for (let i = 0; i < participantsSize; i++) {
                let indivParticipant = await userModel.findOne({ email: participantsObjectArray[i].email, bitotsavId: participantsObjectArray[i].bitotsavId, teamMongoId: null });
                if (indivParticipant) {
                    if (indivParticipant.soloEventsRegistered.find((event) => event.eventId === eventId)) {
                        return res.json({ status: 403, message: `Participant (${indivParticipant.name}) is already registered in this event.` });
                    }
                    continue;
                }
                return res.json({ status: 403, message: `Invalid credentials of the participant with email: ${participantsObjectArray[i].email}, Ensure the participant is not already in a team.` });
            }

            // Register for the event
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
            await userModel.updateMany({ email: { $in: soloParticipantsEmail } }, {
                $push: { soloEventsRegistered: event }
            });
            return res.json({ status: 200, message: `${rawUser.name} have successfully registered for ${eventName} as the event leader.` });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ status: 500, message: "Internal server error!!" });
    }
});


router.post('/deregister', verifyToken, async (req, res) => {
    try {
        const userMongoId = req.userId;
        const rawUser = await userModel.findById(userMongoId);
        if (!rawUser) {
            return res.json({ status: 400, message: "User not found." });
        }

        const eventId = Number(req.body.eventId);
        if (!eventId) {
            return res.json({ status: 400, message: "Invalid Event Id." });
        }

        // Event Name will not be in body
        const eventDetail = await eventModel.findOne({ id: eventId });
        if (!eventDetail) {
            return res.json({ status: 400, message: "Invalid Event Id." });
        }
        const eventName = eventDetail.name;

        const teamMongoId = rawUser.teamMongoId;
        const userBitotsavId = rawUser.bitotsavId;

        if (eventDetail.group === 1) {
            if (!rawUser.isTeamLeader) {
                return res.json({ status: 400, message: "Only Team Leader can de-register the event" })
            }
            const teamEventsReg = rawUser.teamEventsRegistered;
            const event = teamEventsReg.find((eventObj) => eventObj.eventId === eventId);
            if (!event) {
                return res.json({ status: 403, message: "Can't deregister if you are not registered in the first place." });
            }

            // Not Possible, but adds a bit of shield
            const leaderBitotsavId = event.eventLeaderBitotsavId;
            if (userBitotsavId !== leaderBitotsavId) {
                return res.json({ status: 403, message: "Only event leader is allowed to deregister the team from any event." });
            }

            await userModel.updateMany({ teamMongoId: teamMongoId }, { $pull: { teamEventsRegistered: { eventId: eventId } } });
            await teamModel.updateOne({ _id: teamMongoId }, {
                $pull: { eventsRegistered: { eventId: eventId } },
                $push: {
                    teamNotifications: { message: `${rawUser.name} deregistered the team from the event ${eventName}` }
                }
            });
            return res.json({ status: 200, message: `Successfully deregistered from the event: ${eventName}` });
        }

        if (eventDetail.individual === 1) {
            const soloEventsReg = rawUser.soloEventsRegistered;

            const event = soloEventsReg.find((eventObj) => eventObj.eventId === eventId);
            if (!event) {
                return res.json({ status: 403, message: "Can't deregister if you are not registered in the first place." });
            }

            const leaderBitotsavId = event.eventLeaderBitotsavId;
            if (userBitotsavId !== leaderBitotsavId) {
                return res.json({ status: 403, message: "Only event leader is allowed to deregister the team from any event." });
            }

            let soloParticipantsEmail = [];
            let soloParticipants = event.members;
            soloParticipants.forEach((participant) => {
                soloParticipantsEmail.push(participant.email);
            });

            await userModel.updateMany({ email: { $in: soloParticipantsEmail } }, { $pull: { soloEventsRegistered: { eventId: eventId } } });
            return res.json({ status: 200, message: `Successfully de-registered from the event: ${eventName}` });
        }

        if (teamMongoId) {
            const teamEventsReg = rawUser.teamEventsRegistered;

            // Check1....user must be registered in the team event specified by eventId
            const event = teamEventsReg.find((eventObj) => eventObj.eventId === eventId);
            if (!event) {
                return res.json({ status: 403, message: "Can't deregister if you are not registered in the first place." });
            }

            // Check2....user must be the event leader for that event
            const leaderBitotsavId = event.eventLeaderBitotsavId;
            if (userBitotsavId !== leaderBitotsavId) {
                return res.json({ status: 403, message: "Only event leader is allowed to deregister the team from any event." });
            }

            // De-register from the event
            await userModel.updateMany({ teamMongoId: teamMongoId }, { $pull: { teamEventsRegistered: { eventId: eventId } } });
            await teamModel.updateOne({ _id: teamMongoId }, {
                $pull: { eventsRegistered: { eventId: eventId } },
                $push: {
                    teamNotifications: { message: `${rawUser.name} deregistered the team from the event ${eventName}` }
                }
            });
            return res.json({ status: 200, message: `Successfully deregistered from the event: ${eventName}` });
        }
        else {
            const soloEventsReg = rawUser.soloEventsRegistered;

            // Check1....user must be registered in the solo event specified by eventId
            const event = soloEventsReg.find((eventObj) => eventObj.eventId === eventId);
            if (!event) {
                return res.json({ status: 403, message: "Can't deregister if you are not registered in the first place." });
            }

            // Check2....user must be the event leader for that event
            const leaderBitotsavId = event.eventLeaderBitotsavId;
            if (userBitotsavId !== leaderBitotsavId) {
                return res.json({ status: 403, message: "Only event leader is allowed to deregister the team from any event." });
            }

            // De-register from the event
            let soloParticipantsEmail = [];
            let soloParticipants = event.members;
            soloParticipants.forEach((participant) => {
                soloParticipantsEmail.push(participant.email);
            });

            await userModel.updateMany({ email: { $in: soloParticipantsEmail } }, { $pull: { soloEventsRegistered: { eventId: eventId } } });
            return res.json({ status: 200, message: `Successfully de-registered from the event: ${eventName}` });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ status: 500, message: "Internal server error." });
    }
});

router.post("/getTeamNotifications", verifyToken, async (req, res) => {
    const user = await userModel.findById(req.userId);
    if (!user) {
        return res.json({ status: 400, message: "User not found" });
    }
    const teamId = user.teamMongoId;
    const team = await teamModel.findById(teamId);
    if (!team) {
        return res.json({ status: 400, message: "User not registered in a team" });
    }
    return res.json({ status: 200, message: team.teamNotifications });
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
            message: "Ensure that unique Bitotsav ids are used for team registration!"
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
            message: "Ensure that unique email ids are used for team registration!"
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
                        message: `Invalid credentials of member ${i + 1}`
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
                } else if (Array.isArray(foundUser.teamEventsRegistered) && foundUser.teamEventsRegistered.length > 0) {
                    // Not possible though
                    return res.json({
                        status: 415, message: `Member ${i + 1} is registered in some events, de-register his/her existing events and try again.`
                    });
                } else if (Array.isArray(foundUser.soloEventsRegistered) && foundUser.soloEventsRegistered.length > 0) {
                    foundUser.soloEventsRegistered.forEach(async (val) => {
                        const eventId = val.eventId;
                        const eventDetail = await eventModel.findById(eventId);
                        if (eventDetail.group === 1 || eventDetail.individual === 0) {
                            return res.json({
                                status: 415, message: `Member ${i + 1} is registered in some events, de-register his/her existing events and try again.`
                            });
                        }
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
            newTeam.teamNotifications.push({ message: `${user.name} registered the team ${newTeam.teamName} with ${newTeam.teamSize} members.` });
            try {
                await newTeam.save();
            } catch (e) {
                return console.log(e);
            }
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, message: "Internal server error" });
        }
    }
    teamRegister();
});

// Might be incorrect
router.post("/deleteTeam", verifyToken, (req, res) => {
    const userId = req.userId;
    async function deleteTeam() {
        try {
            const userFound = await userModel.findById(userId);
            if (!userFound) {
                return res.json({
                    status: 422,
                    message: "User not found"
                });
            }
            const teamMongoId = userFound.teamMongoId;
            const isTeamLeader = userFound.isTeamLeader;
            if (!teamMongoId) {
                return res.json({
                    status: 422,
                    message: "You are not in a Team!"
                });
            }
            if (!isTeamLeader) {
                return res.json({
                    status: 422,
                    message: "Only team leader can delete the team!"
                });
            }
            const teamDetails = await teamModel.findById(teamMongoId);
            if (!teamDetails) {
                return res.json({ status: 422, message: "Team Doesn't Exist" });
            }
            if (teamDetails.leaderId !== userId) {
                return res.json({ status: 422, message: "Not a leader of this Team" });
            }
            if (!teamDetails.teamMembers) {
                return res.json({ status: 422, message: "Empty Team" });
            }
            const teamSize = teamDetails.teamSize;
            let bitIds = [];
            for (let i = 0; i < teamSize; i++) {
                bitIds.push(teamDetails.teamMembers[i].bitotsavId);
            }
            const modifiedUsers = await userModel.updateMany({ bitotsavId: { $in: bitIds } }, {
                $set: {
                    teamMongoId: null,
                    teamEventsRegistered: []
                }
            }
            );
            const NotaTeamLeader = await userModel.updateOne({ bitotsavId: userFound.bitotsavId }, { $set: { isTeamLeader: false } });

            const teamDeleted = await teamModel.deleteOne({ _id: teamMongoId });

            return res.json({
                status: 200,
                message: "Team deleted successfully!"
            });
        }
        catch (err) {
            console.log(err);
            return res.json({ status: 500, message: "Error on the server!" });
        }
    }
    deleteTeam();
});

module.exports = router;