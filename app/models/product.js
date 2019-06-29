const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema({
    name: String,
    image: String,
    info: String,
    price: Number,
    quantity: Number,
    category: {type: Schema.Types.ObjectId, ref: 'CategoryProduct'}
});

mongoose.model('Product', ProductSchema);