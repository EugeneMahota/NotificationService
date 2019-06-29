const express = require('express');
const mongoose = require('mongoose');
require('./app/models');
const config = require('./config');

const app = express();
config.express(app);
config.routes(app);
const {appPort, mongoUrl} = config.app;

app.use(express.static('public'));

mongoose.connect(mongoUrl, {useNewUrlParser: true})
    .then(() => {
        app.listen(appPort, () => {
            console.log('Start server!');
        });
    })
    .catch(err => {
        console.log(err);
    });

mongoose.set('useFindAndModify', false);