const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}]
});

mongoose.model('Section', SectionSchema);