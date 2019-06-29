const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: String,
    price: Number,
    info: String,
    image: String,
    category: String
});

mongoose.model('Service', ServiceSchema);