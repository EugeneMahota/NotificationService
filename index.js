const express = require('express');
const mongoose = require('mongoose');
require('./app/models');
const config = require('./config');
const path = require('path');

const app = express();
const expressWs = require('express-ws')(app);

config.cors(app);
config.express(app);
config.routes(app);

const {appPort, mongoUrl} = config.app;

app.use(express.static('public'));
app.use(express.static('view'));
app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/view/')));


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