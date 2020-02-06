const express = require('express');
const eventModel = require('../models/events');
const router = express.Router();

//1.getEventByCategory .......Here category can be like "Dhwani", "Dansation", etc
router.get('/getEventByCategory', async (req, res) => {
    try {
        if (!req.query.category) {
            return res.json({ status: 422, message: "Missing query parameter!!" });
        }
        const category = req.query.category.toLowerCase();
        const events = await eventModel.find({ eventCategory: category }, { "faculty advisors": 0, _id: 0, club: 0, "resources required": 0 });
        if (!events) {
            return res.json({ status: 404, message: "No Event Found" });
        }
        return res.json({ status: 200, data: events });
    }
    catch (e) {
        return res.json({ status: 500, message: "Internal server error!! Try again!" });
    }
});


//2.getEventById......Id can be from 0 to 39
router.get('/getEventById', async (req, res) => {
    try {
        if (req.query.id === undefined) {
            return res.json({ status: 422, message: "Missing query parameter!!" });
        }
        const eventId = req.query.id;
        const event = await eventModel.find({ id: eventId }, { "faculty advisors": 0, _id: 0, club: 0, "resources required": 0 });
        if (!event) {
            return res.json({ status: 404, message: "No Event Found" });
        }
        return res.json({ status: 200, data: event });
    }
    catch (e) {
        return res.json({ status: 500, message: "Internal server error! Try again." });
    }
});

router.get('/allEvents', async (req, res) => {
    try {
        const events = await eventModel.find({}, { "faculty advisors": 0, _id: 0, club: 0, "resources required": 0 });
        return res.json({ status: 200, events: events });
    } catch (e) {
        return res.json({ status: 500, message: "Server Error." });
    }
});

module.exports = router;