const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    info: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    flActive: {type: Boolean, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'CategoryProduct'},
    number: {type: Number}
});

mongoose.model('Product', ProductSchema);