const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    telephone: {type: Number, required: true},
    date: {type: Date, required: true},
    status: {type: String, required: true},
    service: {type: Schema.Types.ObjectId, ref: 'Service'},
    info: {type: String},
    price: {type: Number, required: true},
    comment: {type: String},
    dateCompleted: {type: Date}
});

mongoose.model('Order', OrderSchema);