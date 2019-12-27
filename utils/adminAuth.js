const config = require('../config');

// (Publicity = Finance = Events) < Web Admin

const adminAuth = (role, password) => {
    if (config.webAdmin === password) {
        return 1;
    }
    if (role === 'publicity' && config.publicityAdmin === password) {
        return 1;
    }
    // Create Another Role
    return 0;
};

module.exports = adminAuth;