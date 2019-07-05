const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    service: [{type: Schema.Types.ObjectId, ref: 'Service'}]
});

mongoose.model('Category', CategorySchema);