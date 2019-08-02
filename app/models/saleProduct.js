const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleProductSchema = new mongoose.Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, required: true}
});

mongoose.model('SaleProduct', SaleProductSchema);