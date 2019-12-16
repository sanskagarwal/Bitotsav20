const nodemailer = require("nodemailer");
const config = require("./../config");

const sendEmail = (subject, htmlMessage, email) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.username,
            pass: config.email.password
        },
        secure: true,
        pool: true
    });

    const message = {
        from: "Bitotsav Team <webmaster@bitotsav.in>",
        to: email,
        subject: subject, // Subject line
        html: htmlMessage
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Email Sent");
        }
    });
}

module.exports = sendEmail;