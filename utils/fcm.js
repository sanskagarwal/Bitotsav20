var { google } = require('googleapis');
var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
var SCOPES = [MESSAGING_SCOPE];
var PROJECT_ID = 'bitotsav-fb4f8';
var HOST = 'fcm.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';

/**
 * Get a valid access token.
 */

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var key = require('./service-account.json');
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

/**
 * Send HTTP request to FCM with given message.
 *
 * @param {JSON} fcmMessage will make up the body of the request.
 */

function sendFcmMessage(fcmMessage) {
    getAccessToken().then(function (accessToken) {
        var options = {
            hostname: HOST,
            path: PATH,
            method: 'POST',
            // [START use_access_token]
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
            // [END use_access_token]
        };

        var request = https.request(options, function (resp) {
            resp.setEncoding('utf8');
            resp.on('data', function (data) {
                console.log('Message sent to Firebase for delivery, response:');
                console.log(data);
            });
        });

        request.on('error', function (err) {
            console.log('Unable to send message to Firebase');
            console.log(err);
        });

        request.write(JSON.stringify(fcmMessage));
        request.end();
    });
}

/* Message Form

    {
  "message": {
    "topic": "news",
    "notification": {
      "title": "Breaking News",
      "body": "New news story available."
    },
    "data": {
      "story_id": "story_12345"
    }
  }
}

 */