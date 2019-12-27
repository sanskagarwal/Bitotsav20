const express = require("express");
const router = express.Router();

const sap = require('./sap');
const authenticate = require('./authenticate');
const admin = require('./admin');

router.use('/sap', sap);
router.use('/auth', authenticate);
router.use('/admin', admin);

module.exports = router;