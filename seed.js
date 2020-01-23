// Database seed file (Proceed with caution!!)

// Models
const eventModel = require('./models/events');
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
        if(!val.maxParticipants) {
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
}