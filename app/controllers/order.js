const mongoose = require('mongoose');
const Order = mongoose.model('Order');

const getAll = (req, res) => {
    Order.find()
        .populate('service')
        .exec()
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
};

const getByTelephone = (req, res) => {
    Order.find({telephone: req.params.telephone})
        .populate('service')
        .exec()
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
};

const create = (req, res) => {
    req.body.date = new Date();
    Order.create(req.body)
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
};

const update = (req, res) => {
    const order = req.body;

    Order.updateOne({_id: order.id}, order)
        .exec()
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
};

const remove = (req, res) => {
    Order.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
};

module.exports = {
    getAll,
    getByTelephone,
    create,
    update,
    remove
};