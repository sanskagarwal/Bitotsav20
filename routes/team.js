const express = require('express');
const coreTeamModel = require('../models/coreTeam');
const router = express.Router();

router.get('/allCoreTeam', (req, res) => {
    coreTeamModel.find({}, { _id: 0, timestamp: 0 }, (err, data) => {
        if (err) {
            return res.json({ status: 500, message: "Server Error" });
        }
        return res.json({ status: 200, details: data });
    })
});

module.exports = router;