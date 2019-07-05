const app = require('./app');
const routes = require('./routes');
const express = require('./express');
const cors = require('./cors');

module.exports = {
    app,
    express,
    routes,
    cors
};