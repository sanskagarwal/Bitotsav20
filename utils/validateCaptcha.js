const axios = require('axios');
const config = require('../config');

function validateCaptcha(req, res, next) {
    const secret = config.secret_key_captcha;
    const response = req.body.captchaToken;
    if (!response) {
        return res.json({ status: 422, message: "Invalid Captcha" });
    }
    axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`)
        .then(function (response) {
            if (response && response.data.success) {
                next();
            } else {
                return res.json({ status: 422, msg: "Invalid Captcha" });
            }
        })
        .catch(function (error) {
            return res.json({ status: 500, msg: "Server Error" });
        });
}

module.exports = validateCaptcha;
