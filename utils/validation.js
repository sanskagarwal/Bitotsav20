const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');

const validate = (method) => {
    switch (method) {
        case 'sapUser': {
            return [
                body('name', 'Invalid Name field').exists().trim().isLength({ min: 1 }),
                body('email', 'Invalid email').exists().trim().isEmail(),
                body('college', 'College Required').exists().isString().isLength({ min: 1 }),
                body('phone', 'Invalid Phone(10 digit)').exists().isNumeric({ no_symbols: true }).isLength({ min: 10, max: 10 }),
                body('ans1', 'Question 1 required (max 500 chars)').exists().isString().trim().isLength({ min: 1, max: 500 }),
                body('ans2', 'Question 2 required (max 500 chars)').exists().isString().trim().isLength({ min: 1, max: 500 }),
                body('ans3', 'Question 3 required (max 500 chars)').exists().isString().trim().isLength({ min: 1, max: 500 }),
                body('ans4', 'Question 4 required (max 500 chars)').exists().isString().trim().isLength({ min: 1, max: 500 }),
                body('ans5', 'Question 5 required (max 500 chars)').exists().isString().trim().isLength({ min: 1, max: 500 }),
                sanitizeBody('name').trim(),
                sanitizeBody('email').trim(),
                sanitizeBody('college').trim(),
                sanitizeBody('ans1').trim(),
                sanitizeBody('ans2').trim(),
                sanitizeBody('ans3').trim(),
                sanitizeBody('ans4').trim(),
                sanitizeBody('ans5').trim()
            ]
        }
        case 'verifySapUser': {
            return [
                body('otp', 'Invalid OTP').exists().trim().isNumeric().isLength({ min: 6, max: 6 }),
                body('email', 'Invalid email').exists().trim().isEmail(),
                sanitizeBody('email').trim(),
                sanitizeBody('otp').trim()
            ]
        }
    }
}

module.exports = {
    validate
};