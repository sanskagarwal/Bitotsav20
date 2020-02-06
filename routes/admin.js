const express = require("express");
const router = express.Router();
const axios = require('axios');
const adminAuth = require('./../utils/adminAuth');
const sendFcmMessage = require('./../utils/fcm');
const Sap = require('./../models/studentAmbassador');
const eventModel = require('./../models/events');
const userModel = require('./../models/user');
const teamModel = require('./../models/team');
const announcementModel = require('./../models/announcement');
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
    const validForEventsTeam = adminAuth('events', req.body.password);
    const validForPublicityTeam = adminAuth('publicity', req.body.password);
    if (!validForEventsTeam && !validForPublicityTeam) {
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
        const eventDetails = await eventModel.findOne({ id: eventId });
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
                    teamMembers: events.members,
                    college: user.clgName
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
                            }],
                            college: user.clgName
                        });
                    } else {
                        mainUsers.push({
                            teamId: team.teamId,
                            teamName: team.teamName,
                            leaderName: user.name,
                            leaderPhoneNo: user.phoneNo,
                            teamMembers: events.members,
                            college: user.clgName
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










//notifications
router.post('/announcement', (req, res, next) => {
    const valid = adminAuth('web', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised"
        });
    }
    next();

}, async (req, res) => {
    try {
        const title = req.body.title.toString().trim();
        const message = req.body.message.toString().trim();

        console.log(title, message);

        if (!title || !message) {
            return res.json({
                status: 422,
                message: "Missing Fields!"
            });
        }

        const newannouncement = await announcementModel.create({
            title: title,
            message: message
        });

        const announcementMongoId = newannouncement._id;
        console.log(announcementMongoId);


        // sendFcmMessage({
        //     "message": {
        //         "topic": "General",
        //         "notification": {
        //             "title": title,
        //             "body": message
        //         },
        //         "data": {
        //             "notification_id": notificationMongoId
        //         }
        //     }
        // });


        return res.json({
            status: 200,
            message: "Notification sent successfully!"
        });

    }
    catch (e) {
        return res.json({
            status: 500,
            message: "Server Error!"
        });
    }


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

router.post("/leaderboard", async (req, res) => {
    try {
        const leaderboard = await teamModel.
            find({ 'teamVerified': true }).
            sort({ points: -1 }).
            select({ _id: 0, teamName: 1, teamId: 1, points: 1 });
        return res.send({ status: 200, leaderboard: leaderboard });
    }
    catch (e) {
        return res.send({ status: 500, message: 'Error on the server!' });
    }
});

// Might be incorrect
router.post("/deleteTeam", (req, res) => {
    const valid = adminAuth('web', req.body.password);
    if (!valid) {
        return res.json({
            status: 401,
            message: "Not Authorised"
        });
    }
    async function deleteTeam() {
        try {
            const teamDetails = await teamModel.findOne({ teamId: req.body.teamId });
            if (!teamDetails) {
                return res.json({ status: 422, message: "Team not found" });
            }
            const teamSize = teamDetails.teamSize;
            let bitIds = [];
            for (let i = 0; i < teamSize; i++) {
                bitIds.push(teamDetails.teamMembers[i].bitotsavId);
            }
            await userModel.updateMany({ bitotsavId: { $in: bitIds } }, {
                $set: {
                    teamMongoId: null,
                    teamEventsRegistered: [],
                    isTeamLeader: false
                }
            }
            );
            await teamModel.deleteOne({ teamId: req.body.teamId });
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


/* 
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

router.post("/eventWinners", (req, res) => { });
*/

module.exports = router;