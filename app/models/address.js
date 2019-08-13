const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    city: {type: String, required: true},
    address: {type: String, required: true}
});

mongoose.model('Address', AddressSchema);