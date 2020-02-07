// Database seed file (Proceed with caution!!)

// Models
const eventModel = require('./models/events');
const userModel = require('./models/user');
const teamModel = require('./models/team');
const coreTeamModel = require('./models/coreTeam');
const bitIdCounter = require('./models/bitIdCounter');
const sapIdCounter = require('./models/sapIdCounter');
const teamIdCounter = require('./models/teamIdCounter');

// Json
const dhwani = require('./eventsJson/cleaned/dhwani');
const dansation = require('./eventsJson/cleaned/dansation');
const adaa = require('./eventsJson/cleaned/adaa');
const digitales = require('./eventsJson/cleaned/digitales');
const euphoria = require('./eventsJson/cleaned/euphoria');
const herald = require('./eventsJson/cleaned/herald');
const meraki = require('./eventsJson/cleaned/meraki');
const rhetoric = require('./eventsJson/cleaned/rhetoric');
const swaang = require('./eventsJson/cleaned/swaang');
const taabiir = require('./eventsJson/cleaned/taabiir');

const connectDB = require('./db/mongoose_connection');
connectDB();

const req = Number(process.argv[2]);
console.log(`Requested route: ${req}`);


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

if (req === 1) {
    teamIdCounter.find({}, (err, docs) => {
        if (err) {
            return console.log(err);
        }
        if (!docs) {
            teamIdCounter.insertOne({ count: 200001 }, (err, save) => {
                if (err) {
                    return console.log(err);
                }
                return console.log("Inserted");
            });
        }
    });
} else if (req === 2) {
    sapIdCounter.find({}, (err, docs) => {
        if (err) {
            return console.log(err);
        }
        if (!docs) {
            sapIdCounter.insertOne({ count: 2000001 }, (err, save) => {
                if (err) {
                    return console.log(err);
                }
                return console.log("Inserted");
            });
        }
    });
} else if (req === 3) {
    bitIdCounter.find({}, (err, docs) => {
        if (err) {
            return console.log(err);
        }
        if (!docs) {
            bitIdCounter.insertOne({ count: 200001 }, (err, save) => {
                if (err) {
                    return console.log(err);
                }
                return console.log("Inserted");
            });
        }
    });
} else if (req === 4) {
    console.log("It will delete events");
    const events = [...dhwani, ...dansation, ...adaa, ...digitales, ...euphoria, ...herald, ...meraki, ...rhetoric, ...swaang, ...taabiir];
    eventModel.deleteMany({}, (err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Events Deleted");
        eventModel.insertMany(events)
            .then(() => {
                return console.log("Inserted Events");
            })
            .catch((error) => {
                return console.log(error);
            });
    });
} else if (req === 5) {
    console.log("It will delete Team");
    return console.log("Closing the route......");
    let teamJson = require('./teamJson/team.json');
    teamJson = [...teamJson];
    coreTeamModel.deleteMany({}, (err, res) => {
        if (err) {
            return console.log(err);
        }
        console.log("Team Deleted");
        coreTeamModel.insertMany(teamJson)
            .then(() => {
                return console.log("Inserted Team");
            })
            .catch((error) => {
                return console.log(error);
            })
    });
} else if (req === 6) {
    const events = [...dhwani, ...dansation, ...adaa, ...digitales, ...euphoria, ...herald, ...meraki, ...rhetoric, ...swaang, ...taabiir];
    let nameList = new Set();
    let mySet = new Set();
    events.forEach((val) => {
        if (!val.maxParticipants) {
            console.log(val.name);
            console.log(val.eventCategory)
        }
        nameList.add(val.name);
        mySet.add(val.imageName);
    });
    console.log(nameList.size);
    console.log(mySet.size);
    eventModel.find({}, (err, eventRes) => {
        if (err) {
            return console.log(err);
        }
        console.log(eventRes.length);
        let nameList = new Set();
        let mySet = new Set();
        eventRes.forEach((val) => {
            nameList.add(val.name);
            mySet.add(val.imageName);
        });
        console.log(nameList.size);
        console.log(mySet.size);
    });
} else if (req === 7) {
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
        console.log(bitUsers, totalUsers, outsideUsers, teamCount);
    }).catch((err) => {
        console.log(err);
    });
} else if (req === 8) {
    console.log("It will fix error in user Model");
    const groupEventIds = [0, 1, 2, 3, 4, 7, 8, 21];
    return console.log("Fixed :)");
    async function correctGroup() {
        try {
            users = await userModel.find({ isVerified: true, "soloEventsRegistered.eventId": { $in: groupEventIds } });
            console.log(users.length);
            let cnt = 0;
            for (let j = 0; j < users.length; j++) {
                const user = users[j];
                for (let i = 0; i < user.soloEventsRegistered.length; i++) {
                    const event = user.soloEventsRegistered[i];
                    if ((groupEventIds.includes(event.eventId)) && (user.bitotsavId == event.eventLeaderBitotsavId)) {
                        cnt++;
                        user.soloEventsRegistered[i].members[0].email = user.email;
                    }
                }
                await user.save();
                console.log(j);
            }
            console.log(cnt);
        } catch (e) {
            console.log(e);
        }
    }
    // correctGroup();
} else if (req === 9) {
    console.log("It will list the disaster caused by my little mistake");
    userModel.find({ isVerified: false, "soloEventsRegistered.0": { "$exists": true } }, (err, users) => {
        if (err) {
            return console.log("Some err");
        }
        console.log(users);
    })
} else if (req === 10) {
    console.log("It will correct the un-verified users participating in events");
    return console.log("Alread Fixed");
    userModel.updateMany({ isVerified: false, "soloEventsRegistered.0": { "$exists": true } }, { $set: { soloEventsRegistered: [] } }, async (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("Fixed");
    });
} else if (req === 11) {
    console.log("It will find invalid teams");
    const teamEventIds = [];
    eventModel.find({ individual: 0, group: 0 }, { _id: 0, id: 1 }, (err, events) => {
        if (err) {
            return console.log(err);
        }
        events.forEach((eve) => {
            teamEventIds.push(eve.id);
        });
        teamModel.find({}, async (err, teams) => {
            if (err) {
                return console.log(err);
            }
            for (let i = 0; i < teams.length; i++) {
                const team = teams[i];
                for (let j = 0; j < team.teamMembers.length; j++) {
                    const user = team.teamMembers[j];
                    const userDetails = await userModel.findOne({ email: user.email });
                    for (let k = 0; k < userDetails.soloEventsRegistered.length; k++) {
                        const event = userDetails.soloEventsRegistered[k];
                        if (teamEventIds.includes(event.eventId)) {
                            console.log(`Fucked by Team ${team.teamId}, Member ${user.email} - ${user.name}`);
                        }
                    }
                }
            }
        });
    })
} else if (req === 12) {
    console.log("It will fix both invalid users");
    return console.log("Fixed");
    userModel.updateOne({ email: "sharmaashvini961@gmail.com" }, { $set: { soloEventsRegistered: [] } }, (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("Fixed 1");
    });
    userModel.updateOne({ email: "pallaviwagadre1998@gmail.com" }, { $set: { soloEventsRegistered: [] } }, (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("Fixed 2");
    });
} else if (req === 13) {
    console.log("It will check any DB inconsistent users");
    userModel.find({ teamMongoId: { $ne: null } }, async (err, users) => {
        if (err) {
            return console.log(err);
        }
        for (let i = 0; i < users.length; i++) {
            const team = await teamModel.findById(users[i].teamMongoId);
            if (!team) {
                console.log(users[i].bitotsavId);
            }
        }
        console.log("done");
    });
}