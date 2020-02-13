const config = require('./../config');
const axios = require('axios');

const sendOneSignal = (title, message) => {
    let otpUrl = `https://onesignal.com/api/v1/notifications`;

    const headers = {
	  'Content-Type': 'application/json; charset=utf-8',
	  'Authorization': `BASIC ${config.oneSignalAPIKey}`
	}

	const data = {
		"app_id": config.oneSignalAppId,
		"contents": {"en": message},
		"headings": {"en": title},
		"url": "https://onesignal.com",
		"included_segments": ["All"]
	}

    axios({
    	method: "POST",
    	url: otpUrl,
    	headers: headers,
    	data: data
    })
        .then(function (response) {
            console.log("Notification sent");
        })
        .catch(function (error) {
            console.log("error sending notification");
        })
};

module.exports = sendOneSignal;