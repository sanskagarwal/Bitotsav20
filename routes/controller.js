const express = require("express");
const router = express.Router();

const sap = require('./sap');
const authenticate = require('./authenticate');

router.use('/sap', sap);
router.use('/auth', authenticate);

module.exports = router;