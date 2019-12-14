const mongoose = require('mongoose');
const config = require('../config');

//MongoDb Connections
function connect() {

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.connect(config.mongoURL, { useUnifiedTopology: true });
    
    mongoose.connection.once('open', function () {
        console.log("Database connection opened");
    });

    mongoose.connection.on('error', function (error) {
        console.log("Database connection error");
    });

    mongoose.connection.on('reconnected', function () {
        console.log("Database reconnected");
    });

    mongoose.connection.on('disconnected', function () {
        console.log("Database disconnected");
        mongoose.connect(config.url, { useNewUrlParser: true });
    });
}

module.exports = connect;