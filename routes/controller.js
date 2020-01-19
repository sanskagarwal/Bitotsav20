const express = require("express");
const router = express.Router();

const sap = require('./sap');
const authenticate = require('./authenticate');
const admin = require('./admin');
const events = require('./events');
const dashboard = require('./dashboardRoutes');
const coreTeam = require('./team');
const contact = require('./contact');

router.use('/sap', sap);
router.use('/auth', authenticate);
router.use('/admin', admin);
router.use('/events', events);
router.use('/dash', dashboard);
router.use('/team', coreTeam);
router.use('/contact', contact);

module.exports = router;