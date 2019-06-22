const express = require('express');
const mongoose = require('mongoose');
require('./app/models');
const config = require('./config');

const app = express();
config.express(app);
config.routes(app);

const {appPort, mongoUrl} = config.app;

mongoose.connect(mongoUrl, {useNewUrlParser: true})
    .then(() => {
        app.listen(appPort, () => {
            console.log('Start server!');
        });
    })
    .catch(err => {
        console.log(err);
    });