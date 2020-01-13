const express = require("express");
const router = express.Router();

const sap = require('./sap');
const authenticate = require('./authenticate');
const admin = require('./admin');
const events = require('./events');

router.use('/sap', sap);
router.use('/auth', authenticate);
router.use('/admin', admin);
router.use('/events', events);

module.exports = router;