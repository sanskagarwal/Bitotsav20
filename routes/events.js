const express = require('express');
const eventModel = require('../models/events');
const router = express.Router();

const dhwani = require('../eventsJson/cleaned/dhwani');
const dansation = require('../eventsJson/cleaned/dansation');


//to insert to database
router.get('/addMultipleEvents', (req, res)=>{
    const events = [...dhwani, ...dansation];
    eventModel.insertMany(events)
        .then(()=>{
            return res.json({status: 200, message: "Inserted successfully!!"});
        })
        .catch((error)=>{
            return res.json({status: 500, message: "Internal server error!! Try again!"});
        })
});



//1.getEventByCategory .......Here category can be like "Dhwani", "Dansation", etc
router.get('/getEventByCategory', async(req, res)=>{
    try{
        if(!req.query.category) {
            return res.json({status: 422, message: "Missing query parameter!!"});
        }
        const category = req.query.category;
        const events = await eventModel.find({eventCategory: category}, {"faculty advisors": 0, _id: 0, club: 0, "resources required": 0});
        if(!events) {
            return res.json({status: 404, message: "No Event Found"});
        }
        return res.json({status: 200, data: events});
    }
    catch(e){
        return res.json({status: 500, message: "Internal server error!! Try again!"});
    }
});


//2.getEventById......Id can be from 0 to 39
router.get('/getEventById', async(req, res)=>{
    try{
        if(!req.query.id) {
            return res.json({status: 422, message: "Missing query parameter!!"});
        }
        const eventId = req.query.id;
        const event = await eventModel.find({id: eventId}, {"faculty advisors": 0, _id: 0, club: 0, "resources required": 0});
        if(!event) {
            return res.json({status: 404, message: "No Event Found"});
        }
        return res.json({status: 200, data: event});
    }
    catch(e){
        return res.json({status: 500, message: "Internal server error! Try again."});
    }
});

router.get('/allEvents', async (req, res) => {
    try {
        const events = await eventModel.find({}, {"faculty advisors": 0, _id: 0, club: 0, "resources required": 0});
        return res.json({ status: 200, events: event });
    } catch(e) {
        return res.json({status: 500, message: "Server Error."});
    }
});




























//for admin
// router.post('/addEvent', function (req, res, next) {

//     const eventId = req.body.eventId;
//     const eventName = req.body.eventName;
//     const club = req.body.club;
//     const venue = req.body.venue;
//     const duration = req.body.duration;
//     const teamSize = req.body.teamSize;
//     const description = req.body.description;
//     const coordinators = req.body.coordinators;
//     const points = req.body.points;
//     const category = req.body.category;
//     if (!eventId) {
//         return res.json({
//             status: 400,
//             message: "Event Id is required!"
//         });
//     }

//     if (!eventName) {
//         return res.json({
//             status: 400,
//             message: "Event Name is required!"
//         });
//     }

//     if (!club) {
//         return res.json({
//             status: 400,
//             message: "Club Name is required!"
//         });
//     }

//     if (!venue) {
//         return res.json({
//             status: 400,
//             message: "Venue is required!"
//         });
//     }

//     if (!duration) {
//         return res.json({
//             status: 400,
//             message: "Duration is required!"
//         });
//     }

//     if (!teamSize) {
//         return res.json({
//             status: 400,
//             message: "team size is required!"
//         });
//     }

//     if (!description) {
//         return res.json({
//             status: 400,
//             message: "description is required!"
//         });
//     }

//     if (!coordinators) {
//         return res.json({
//             status: 400,
//             message: "coodinators are required!"
//         });
//     }

//     if (!category) {
//         return res.json({
//             status: 400,
//             message: "category is required!"
//         });
//     }

//     if (!points) {
//         return res.json({
//             status: 400,
//             message: "points is required!"
//         });
//     }

//     next();
// },
//     function (req, res, next) {
//         const eventId = req.body.eventId;
//         eventModel.findOne({ eventId: eventId }, function (err, event) {
//             if (err) {
//                 return res.json({ status: 500, message: "Internal server error" });

//             }
//             else if (event) {
//                 return res.json({ status: 422, message: "Event id already exits" });
//             }
//             else if (!event) {
//                 next();
//             }
//         })

//     },
//     function (req, res, next) {
//         const eventName = req.body.eventName;
//         eventModel.findOne({ eventName: eventName }, function (err, event) {
//             if (err) {
//                 return res.json({ status: 500, message: "Internal server error" });

//             }
//             else if (event) {
//                 return res.json({ status: 422, message: "Event Name already exits" });
//             }
//             else if (!event) {
//                 next();
//             }
//         })
//     },
//     function (req, res, next) {

//         const eventId = req.body.eventId;
//         const eventName = req.body.eventName;
//         const club = req.body.club;
//         const venue = req.body.venue;
//         const duration = req.body.duration;
//         const teamSize = req.body.teamSize;
//         const description = req.body.description;
//         const coordinators = req.body.coordinators;
//         const points = req.body.points;
//         const category = req.body.category;

//         const event = new eventModel({
//             eventId: eventId,
//             eventName: eventName,
//             club: club,
//             venue: venue,
//             duration: duration,
//             teamSize: teamSize,
//             description: description,
//             coordinators: coordinators,
//             points: points,
//             category: category

//         });
//         event.save();
//         res.json({ status: 200, message: "Event added successfully!" });

//     });


// router.get('/eventById', function (req, res, next) {
//     const eventId = req.body.eventId;
//     eventModel.findOne({ eventId: eventId }, function (err, event) {
//         if (err) {
//             return res.json({ status: 500, message: "Internal server error" });
//         }
//         else if (!event) {
//             return res.json({ status: 422, message: "Event Id not found" });
//         }
//         else {
//             return res.json({ status: 200, event: event });
//         }
//     });
// });



// router.post('/updateEventById', function (req, res, next) {
//     const eventId = req.body.eventId;
//     eventModel.findOne({ eventId: eventId }, function (err, event) {
//         if (err) {
//             return res.json({ status: 500, message: "Internal server error" });
//         }
//         else if (!event) {
//             return res.json({ status: 422, message: "Event Id not found" });
//         }
//         else if (event) {
//             next();
//         }
//     })
// },
//     function (req, res, next) {
//         const eventId = req.body.eventId;
//         const eventName = req.body.eventName;
//         const club = req.body.club;
//         const venue = req.body.venue;
//         const duration = req.body.duration;
//         const teamSize = req.body.teamSize;
//         const description = req.body.description;
//         const coordinators = req.body.coordinators;
//         const points = req.body.points;
//         const category = req.body.category;
//         eventModel.findOne({ eventId: eventId }, function (err, event) {
//             if (err) {
//                 return res.json({ status: 500, message: "Internal server error" });
//             }
//             else {
//                 event.eventName = eventName;
//                 event.club = club;
//                 event.venue = venue;
//                 event.duration = duration;
//                 event.teamSize = teamSize;
//                 event.description = description;
//                 event.coordinators = coordinators;
//                 event.points = points;
//                 event.category = category;
//                 event.save();
//                 return res.json({ status: 200, message: "Event Details Updated successfully" });
//             }
//         })

//     });

module.exports = router;