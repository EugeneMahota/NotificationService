const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    telephone: {type: Number, required: true},
    address: {type: String, required: true},
    flPickup: {type: Boolean, required: true},
    info: {type: String},
    status: {type: String, required: true},
    date: {type: Date, required: true},
    product: [{type: Schema.Types.ObjectId, ref: 'SaleProduct'}]
});

mongoose.model('Sale', SaleSchema);