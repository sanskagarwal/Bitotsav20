const express = require("express");
const router = express.Router();
const adminAuth = require('./../utils/adminAuth');
const sendFcmMessage = require('./../utils/fcm');
const Sap = require('./../models/studentAmbassador');
const eventModel = require('./../models/events');

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
        if (!req.body.eventId) {
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
            message: "Missing Fields"
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