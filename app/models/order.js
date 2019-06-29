const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
    name: String,
    telephone: Number,
    date: Date,
    status: String,
    service: {type: Schema.Types.ObjectId, ref: 'Service'},
    info: String
});

mongoose.model('Order', OrderSchema);