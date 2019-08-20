const mongoose = require('mongoose');

const ConfigAppSchema = new mongoose.Schema({
    name: {type: String, required: true},
    logoLight: {type: String, required: true},
    logoDark: {type: String, required: true},
    imageHeader: {type: String, required: true},
    titleHeader: {type: String, required: true},
    textHeader: {type: String, required: true}
});

mongoose.model('ConfigApp', ConfigAppSchema);