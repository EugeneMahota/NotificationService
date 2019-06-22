const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
    name: String,
    service: [{type: Schema.Types.ObjectId, ref: 'Service'}]
});

mongoose.model('Category', CategorySchema);