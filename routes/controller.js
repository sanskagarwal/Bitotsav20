const express = require("express");
const router = express.Router();

const sap = require('./sap');

router.use('/sap', sap);

module.exports = router;