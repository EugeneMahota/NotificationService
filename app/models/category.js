const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String},
    section: {type: Schema.Types.ObjectId, ref: 'Section'},
    service: [{type: Schema.Types.ObjectId, ref: 'Service'}],
    number: {type: Number}
});

mongoose.model('Category', CategorySchema);