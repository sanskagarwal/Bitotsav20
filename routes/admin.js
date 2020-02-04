const express = require("express");
const router = express.Router();
const axios = require('axios');
const adminAuth = require('./../utils/adminAuth');
const sendFcmMessage = require('./../utils/fcm');
const Sap = require('./../models/studentAmbassador');
const eventModel = require('./../models/events');
const userModel = require('./../models/user');
const teamModel = require('./../models/team');
const config = require('./../config');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

//sap routes
router.post('/getAllSaps', (req, res, next) => {
    const valid = adminAuth('publicity', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised!"
        });
    }
    next();
}, async (req, res) => {
    try {
        const saps = await Sap.find({
            isVerified: true
        }, {
            _id: 0,
            name: 1,
            sapId: 1
        });
        if (!saps) {
            return res.json({
                status: 404,
                message: "Not found!"
            });
        }
        return res.json({
            status: 200,
            saps: saps
        });
    } catch (e) {
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }
});

router.post('/getSapById', (req, res, next) => {
    const valid = adminAuth('publicity', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised!"
        });
    }
    next();
}, async (req, res) => {
    try {
        if (!req.body.sapId) {
            return res.json({
                status: 403,
                message: "Required Id!"
            });
        }
        const saps = await Sap.findOne({
            sapId: Number(req.body.sapId)
        }, {
            _id: 0,
            otp: 0
        });
        if (!saps) {
            return res.json({
                status: 404,
                message: "Not found!"
            });
        }
        return res.json({
            status: 200,
            saps: saps
        });
    } catch (e) {
        console.log(e);
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }
});

//events routes
router.post('/getAllEvents', (req, res, next) => {
    const valid = adminAuth('events', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised!"
        });
    }
    next();
}, async (req, res) => {
    try {
        const events = await eventModel.find({}, {
            _id: 0,
            name: 1,
            id: 1
        }).sort({
            name: 1
        });
        if (!events) {
            return res.json({
                status: 404,
                message: "Not found!"
            });
        }
        return res.json({
            status: 200,
            events: events
        });
    } catch (e) {
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }
});

router.post('/getEventById', (req, res, next) => {
    const valid = adminAuth('events', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised!"
        });
    }
    next();
}, async (req, res) => {
    try {
        if (req.body.eventId === undefined) {
            return res.json({
                status: 403,
                message: "Required Id!"
            });
        }
        const event = await eventModel.findOne({
            id: Number(req.body.eventId)
        });
        if (!event) {
            return res.json({
                status: 404,
                message: "Not found!"
            });
        }
        return res.json({
            status: 200,
            event: event
        });
    } catch (e) {
        console.log(e);
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }
});

router.post('/updateEventById', (req, res, next) => {
    const valid = adminAuth('events', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised!"
        });
    }
    next();
}, async (req, res, next) => {
    try {
        const eventMongoId = req.body._id;
        if (!eventMongoId) {
            return res.json({
                status: 422,
                message: "Event Id not found!"
            });
        }

        const points = req.body.points;

        const venue = req.body.venue;
        if (!venue) {
            return res.json({
                status: 422,
                message: "Venue can't be empty!"
            });
        }

        const description = req.body.description;
        if (!description) {
            return res.json({
                status: 422,
                message: "Description can't be empty!"
            });
        }

        const rulesAndRegulations = req.body.rulesAndRegulations;
        if (!rulesAndRegulations) {
            return res.json({
                status: 422,
                message: "Rules and regulations can't be empty!"
            });
        }

        const contactInformation = req.body.contactInformation;
        if (!contactInformation) {
            return res.json({
                status: 422,
                message: "Contact information can't be empty!"
            });
        }

        const duration = req.body.duration;
        if (!duration) {
            return res.json({
                status: 422,
                message: "Duration can't be empty!"
            });
        }

        const cashPrize = req.body.cashPrize;

        const updatedEvent = await eventModel.updateOne({
            _id: eventMongoId
        }, {
            $set: {
                points,
                venue,
                description,
                rulesAndRegulations,
                contactInformation,
                duration,
                cashPrize
            }
        });

        return res.json({
            status: 200,
            message: "Successfully updated the event!"
        });
    } catch (e) {
        console.log(e);
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }
});

router.post("/getTeamsByEventId", async (req, res) => {
    const valid = adminAuth('events', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised"
        });
    }
    const eventId = req.body.eventId;
    if (eventId === undefined) {
        return res.json({ status: 422, message: "Event Id is required" });
    }
    try {
        const eventDetails = await eventModel.find({ id: eventId });
        if (!eventDetails) {
            return res.json({ status: 422, message: "Invalid Event Id" });
        }
        const mainUsers = [];
        let users = await userModel.find({ "soloEventsRegistered.eventId": eventId });
        users.forEach((user) => {
            const userBitId = user.bitotsavId;
            let events = user.soloEventsRegistered.filter((event) => { // No Strict Matching
                return event.eventLeaderBitotsavId == userBitId && event.eventId == eventId;
            });
            if (events.length > 0) {
                events = events[0];
                mainUsers.push({
                    teamId: "-",
                    teamName: "-",
                    leaderName: user.name,
                    leaderPhoneNo: user.phoneNo,
                    teamMembers: events.members
                });
            }
        });
        users = await userModel.find({ isVerified: true, "teamEventsRegistered.eventId": eventId });
        const teamSearchStart = async () => {
            await asyncForEach(users, async (user) => {
                const userBitId = user.bitotsavId;
                let events = user.teamEventsRegistered.filter((event) => {
                    return event.eventLeaderBitotsavId == userBitId && event.eventId == eventId;
                });
                if (events.length > 0) {
                    events = events[0];
                    const team = await teamModel.findById(user.teamMongoId);
                    if (events.members.length === 0) {
                        mainUsers.push({
                            teamId: team.teamId,
                            teamName: team.teamName,
                            leaderName: user.name,
                            leaderPhoneNo: user.phoneNo,
                            teamMembers: [{
                                email: user.email,
                                bitotsavId: user.bitotsavId
                            }]
                        });
                    } else {
                        mainUsers.push({
                            teamId: team.teamId,
                            teamName: team.teamName,
                            leaderName: user.name,
                            leaderPhoneNo: user.phoneNo,
                            teamMembers: events.members
                        });
                    }
                }
            });
            if (mainUsers.length === 0) {
                return res.json({ status: 404, message: "No Team Found" });
            }
            return res.json({ status: 200, teams: mainUsers });
        }
        teamSearchStart();
    } catch (e) {
        return res.json({ status: 500, message: "Server Error" });
    }
});

//user details routes
router.post('/getUser', (req, res, next) => {
    const validForEventsTeam = adminAuth('events', req.body.password);
    const validForPublicityTeam = adminAuth('publicity', req.body.password);
    if (!validForEventsTeam && !validForPublicityTeam) {
        return res.json({
            status: 401,
            message: "Not Authorised!"
        });
    }
    next();
}, async (req, res) => {
    try {

        if (!req.body.parameter || req.body.parameter === '') {
            return res.json({
                status: 422,
                message: "Missing fields!"
            });
        }
        if (!req.body.paramValue || req.body.paramValue === '') {
            return res.json({
                status: 422,
                message: "Missing fields!"
            });
        }

        const parameter = req.body.parameter;
        let paramValue = req.body.paramValue;
        if (parameter === 'Email') {
            const user = await userModel.findOne({
                email: paramValue
            }, {
                _id: 0,
                name: 1,
                email: 1,
                phoneNo: 1,
                bitotsavId: 1,
                clgName: 1,
                clgId: 1,
                clgCity: 1,
                clgState: 1
            });
            return res.json({
                status: 200,
                user: user
            });
        } else if (parameter === 'Bitotsav Id') {
            if (isNaN(paramValue)) {
                return res.json({
                    status: 422,
                    message: "Bitotsav Id is not a number!",
                    user: null
                });
            }

            const user = await userModel.findOne({
                bitotsavId: Number(paramValue)
            }, {
                _id: 0,
                name: 1,
                email: 1,
                phoneNo: 1,
                bitotsavId: 1,
                clgName: 1,
                clgId: 1,
                clgCity: 1,
                clgState: 1
            });
            return res.json({
                status: 200,
                user: user
            });
        } else {
            return res.json({
                status: 422,
                message: "Invalid Fields!"
            });
        }
    } catch (e) {
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }
});

router.post("/getStats", (req, res) => {
    const valid = adminAuth('publicity', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised"
        });
    }
    let bitUsers = 0, totalUsers = 0, outsideUsers = 0, teamCount = 0;
    let promises = [
        userModel.countDocuments({ clgName: "Birla Institute of Technology, Mesra", isVerified: true }).exec(),
        userModel.countDocuments({ isVerified: true }).exec(),
        teamModel.countDocuments({}).exec()
    ];
    Promise.all(promises).then((results) => {
        bitUsers = results[0];
        totalUsers = results[1];
        outsideUsers = totalUsers - bitUsers;
        teamCount = results[2];
        return res.json({ status: 200, bitUsers, totalUsers, outsideUsers, teamCount });
    }).catch((err) => {
        console.log(err);
        return res.json({ status: 500, message: "Server Error" });
    });
});

router.post('/announcement', (req, res) => {
    const valid = adminAuth('events', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised"
        });
    }
    let title = req.body.title;
    let message = req.body.message;
    if (!title || !message) {
        return res.json({
            status: 422,
            message: "Missing Fields!"
        });
    }
    title = title.trim();
    message = message.trim();
    sendFcmMessage({
        "message": {
            "topic": "general",
            "notification": {
                "title": "Breaking News",
                "body": "New news story available."
            },
            "data": {
                "story_id": "story_12345"
            }
        }
    });
});

router.post("/sendSMS", (req, res) => {
    const valid = adminAuth('web', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised"
        });
    }
    let phoneNo = req.body.phoneNo, message = req.body.message;
    if (!phoneNo || !message) {
        return res.json({ status: 422, message: "Required phone no and message" });
    }
    message = message.trim();
    phoneNo = phoneNo.trim();
    if (phoneNo.length !== 10 || message.length > 130) {
        return res.json({ status: 422, message: "Phone length: 10, Message length: 1-130" });
    }
    let otpUrl = `http://sms.digimiles.in/bulksms/bulksms?username=${config.digimiles.username}&password=${config.digimiles.password}&type=0&dlr=1&destination=${phoneNo}&source=BITOSV&message=${message}`;

    axios.get(otpUrl)
        .then(function (response) {
            console.log("SMS sent");
            return res.json({ status: 200, message: "SMS Sent Successfully" });
        })
        .catch(function (error) {
            console.log(error);
            return res.json({ status: 500, message: "Server Error" });
        });
});



//team details routes
router.post('/getTeam', (req, res, next) => {
    const validForEventsTeam = adminAuth('events', req.body.password);
    const validForPublicityTeam = adminAuth('publicity', req.body.password);
    if (!validForEventsTeam && !validForPublicityTeam) {
        return res.json({
            status: 401,
            message: "Not Authorised!"
        });
    }
    next();
}, async (req, res) => {
    try {

        if (!req.body.parameter || req.body.parameter === '') {
            return res.json({
                status: 422,
                message: "Missing fields!"
            });
        }
        if (!req.body.paramValue || req.body.paramValue === '') {
            return res.json({
                status: 422,
                message: "Missing fields!"
            });
        }

        const parameter = req.body.parameter;

        if (parameter === 'Team Name') {
            const paramValue = req.body.paramValue
                .toString()
                .trim()
                .toLowerCase();

            const team = await teamModel.findOne({
                teamName: paramValue
            }, {
                _id: 0,
                teamName: 1,
                teamId: 1,
                teamSize: 1,
                teamMembers: 1,
                points: 1,
                leaderId: 1,
                leaderName: 1,
                leaderPhoneNo: 1,
                teamVerified: 1
            });
            return res.json({
                status: 200,
                team: team
            });
        } else if (parameter === 'Team Id') {
            const paramValue = req.body.paramValue
                .toString()
                .trim();

            if (isNaN(paramValue)) {
                return res.json({
                    status: 422,
                    message: "Team Id is not a number!",
                    team: null
                });
            }

            const team = await teamModel.findOne({
                teamId: Number(paramValue)
            }, {
                _id: 0,
                teamName: 1,
                teamId: 1,
                teamSize: 1,
                teamMembers: 1,
                points: 1,
                leaderId: 1,
                leaderName: 1,
                leaderPhoneNo: 1,
                teamVerified: 1
            });
            return res.json({
                status: 200,
                team: team
            });
        } else {
            return res.json({
                status: 422,
                message: "Invalid Fields!"
            });
        }
    } catch (e) {
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }
});











/* 
router.post("/teamDetails", adminAuth, async (req, res) => {
    const teamzId = req.body.teamId;
    if (!teamzId) {
        return res.json({ status: 200, message: "invalid team id" });
    }

    try {
        const teamzz = await TeamModel.findOne({ teamId: teamzId });
        const teamMongoId = teamzz._id;
        const teamName = teamzz.teamName;
        const teamSize = teamzz.teamSize;
        const teamId = teamzz.teamId;
        const users = await panUsers.find({ teamMongoId: teamMongoId })
        let members = [];

        for (let i = 0; i < users.length; i++) {
            const memDetails = {
                name: users[i].name,
                email: users[i].email,
                clgId: users[i].clgId,
                pantheonId: users[i].pantheonId
            };

            members.push(memDetails);
        }
        return res.json({ status: 200, teamName, teamSize, teamId, members });

    } catch (err) {
        return res.json({ status: 400, message: "server error" });
    }
});

router.post("/verifyTeam", adminAuth, (req, res) => {
    const id = Number(req.body.teamId);
    if (!id) {
        return res.json({ status: 422, message: "No Team Id Given" });
    }
    async function teamVerify() {
        try {
            let team = await TeamModel.findOne({ 'teamId': id });
            team.teamVerified = true;
            let teamUpdate = team.save();
            return res.json({ status: 200, message: "Team Verified Successfully" });
        } catch (e) {
            return res.json({ status: 500, message: "Error on the server!" });
        }
    }
    teamVerify();
});

router.post("/rejectTeam", adminAuth, (req, res) => {
    const id = Number(req.body.teamId);
    if (!id) {
        return res.json({ status: 422, message: "No Team Id Given" });
    }
    async function teamReject() {
        try {
            let team = await TeamModel.findOne({ 'teamId': id });
            team.teamVerified = false;
            let teamUpdate = team.save();
            return res.json({ status: 200, message: "Team Rejected Successfully" });
        } catch (e) {
            return res.json({ status: 500, message: "Errosr on the server!" });
        }
    }
    teamReject();
});

router.get("/leaderboard", closeRegistration, (req, res) => {
    async function getLeaderboard() {
        try {
            const leaderboard = await TeamModel.
                find({ 'teamVerified': true }).
                sort({ points: -1 }).
                select({ _id: 0, teamName: 1, teamId: 1, points: 1 });
            return res.send({ status: 200, leaderboard: leaderboard });
        }
        catch (e) {
            return res.send({ status: 500, message: 'Error on the server!' });
        }
    }
    getLeaderboard();
});

router.post("/addPoints", webadminAuth, (req, res) => {
    const teamId = req.body.teamId;
    let points = req.body.points;
    points = Number(points);
    if (!points) {
        return res.json({ status: 500, message: "Points should be a number" });
    }

    TeamModel.updateOne({ "teamId": teamId }, { $inc: { "points": points } }, (err, team) => {
        if (err) {
            return res.json({ status: 500, message: err });
        }
        return res.json({ status: 200, message: "Points Added Successfully" });
    });
});

router.post("/pushMessage", webadminAuth, (req, res) => {
    const title = req.body.title;
    const message = req.body.message;

    const notification = new Notification({
        title,
        message
    });
    notification.save((err, notif) => {
        if (err) {
            return res.json({ status: 500, message: err });
        }
        res.json({ status: 200, message: "Notification Pushed" });
    });
});

router.post("/teamRegister", webadminAuth, (req, res, next) => {
    // Data Validation

    if (!req.body.teamName || !req.body.teamSize) {
        return res.json({
            status: 400,
            message: "Team Name and Team size is required"
        });
    }

    let memberDataInBody = req.body.membersData;

    if (!memberDataInBody || memberDataInBody instanceof Array === false) {
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

    if (teamSize > 8 || teamSize < 5) {
        return res.json({
            status: 422,
            message: "Team Size Should be between 5 and 8 members"
        });
    }

    let membersData = [];
    for (let i = 0; i < teamSize; i++) {
        const obj = req.body.membersData[i];
        let panId = obj.pantheonId, emailId = obj.email;
        if (!panId || !emailId) {
            return res.json({ status: 422, message: `Missing Data of member ${i + 1}` });
        }
        try {
            panId = Number(panId);
            if (!panId) {
                throw `Invalid credentials of member ${i + 1}`;
            }
            if (panId % 1 !== 0) {
                throw `Invalid credentials of member ${i + 1}`;
            }
            emailId = emailId.toString().trim();
            if (!isEmail(emailId)) {
                throw `Invalid credentials of member ${i + 1}`;
            }
        } catch (e) {
            return res.json({ status: 422, message: e });
        }
        obj.pantheonId = panId;
        obj.email = emailId;
        membersData.push(obj);
    }

    //check all pantheon ids are unique
    let panIdSet = new Set();
    for (let i = 0; i < teamSize; i++) {
        panIdSet.add(membersData[i].pantheonId);
    }
    if (panIdSet.size < teamSize) {
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
            let user = null;
            const foundUser1 = await UserModel.findById(userId);
            if (!foundUser1) {
                return res.json({ status: 500, message: "Internal server error" });
            }
            user = foundUser1;

            // Check Same Team
            const foundTeam = await TeamModel.findOne({ teamName: teamName });
            if (foundTeam) {
                return res.json({ status: 415, message: "Team name already used!" });
            }

            //check if any member is already in some team and email and panIds are in sync
            for (let i = 0; i < teamSize; i++) {
                let email = membersData[i].email,
                    panId = membersData[i].pantheonId;
                const foundUser = await UserModel.findOne({ email: email });
                if (!foundUser) {
                    return res.json({
                        status: 415,
                        message: `wrong credentials of member ${i + 1}`
                    });
                } else if (!foundUser.pantheonId || !foundUser.email) {
                    return res.json({
                        status: 415,
                        message: `Member ${i + 1} not verified`
                    });
                } else if (
                    foundUser.email !== email ||
                    foundUser.pantheonId !== panId
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
                }
            }

            let newTeam = new TeamModel({ teamName, teamSize });
            newTeam.leaderId = userId;
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
            let panIdsInTeam = [];
            for (let i = 0; i < teamSize; i++) {
                panIdsInTeam.push(membersData[i].pantheonId);
            }
            const modifiedTeams = await UserModel.updateMany(
                { pantheonId: { $in: panIdsInTeam } },
                { $set: { teamMongoId: _id } }
            );
            return res.json({ status: 200, message: "Team registration complete!" });
        } catch (e) {
            return res.json({ status: 500, message: "Internal server error" });
        }
    }
    teamRegister();
});

router.post("/eventWinners", (req, res) => { });

router.post("/updateEvents", (req, res) => { });

router.post("/userRegisterAdmin", (req, res) => { });

router.post("/teamRegisterAdmin", (req, res) => { });
*/

module.exports = router;