const config = require('./../config');
const axios = require('axios');

const sendPM = (message, phoneNo) => {
    let otpUrl = `http://sms.digimiles.in/bulksms/bulksms?username=${config.digimiles.username}&password=${config.digimiles.password}&type=0&dlr=1&destination=${phoneNo}&source=PANTHN&message=${message}`;

    axios.get(otpUrl)
        .then(function (response) {
            console.log("SMS sent");
        })
        .catch(function (error) {
            console.log(error);
        })
};

module.exports = sendPM;