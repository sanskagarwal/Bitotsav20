const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config');
const app = express();
const connectDB = require('./db/mongoose_connection');
const controller = require('./routes/controller');

//database connection
connectDB();


//middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', controller);

//port setup
const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
