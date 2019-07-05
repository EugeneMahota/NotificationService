const cors = require('cors');
const {corsOptions} = require('./app');

module.exports = (app) => {
    app.use(cors(corsOptions));
};