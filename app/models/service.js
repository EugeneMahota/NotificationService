const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    info: {type: String},
    image: {type: String},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
});

mongoose.model('Service', ServiceSchema);