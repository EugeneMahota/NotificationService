const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryProductSchema = new mongoose.Schema({
    name: String,
    product: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

mongoose.model('CategoryProduct', CategoryProductSchema);