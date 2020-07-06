const express = require("express");
const router = express.Router();

const sap = require('./sap');
const authenticate = require('./authenticate');
const admin = require('./admin');
const events = require('./events');
const dashboard = require('./dashboardRoutes');
const coreTeam = require('./team');
const contact = require('./contact');

const closeRegistration = require('./../utils/closeRegistration');

router.use('/sap', closeRegistration ,sap);
router.use('/auth', closeRegistration, authenticate);
router.use('/admin', admin);
router.use('/events', events);
router.use('/dash', dashboard);
router.use('/team', coreTeam);
router.use('/contact', closeRegistration, contact);

module.exports = router;