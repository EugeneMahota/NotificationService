const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    status: {type: String, required: true},
    name: {type: String, required: true},
    telephone: {type: Number, required: true},
    date: {type: Date},
    info: {type: String}
});

mongoose.model('Request', RequestSchema);