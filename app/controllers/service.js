const mongoose = require('mongoose');
const Service = mongoose.model('Service');

const getAll = (req, res) => {
    Service.find()
        .exec()
        .then(service => res.json(service))
        .catch(err => res.status(500).json(err));
};

const create = (req, res) => {
    Service.create(req.body)
        .then(service => res.json(service))
        .catch(err => res.status(500).json(err));
};

const update = (req, res) => {
    Service.findOneAndUpdate({id: req.body.id}, req.body)
        .exec()
        .then(service => res.json(service))
        .catch(err => res.status(500).json(err));
};

const remove = (req, res) => {
    Service.deleteOne({id: req.body.id})
        .exec()
        .then(service => res.json(service))
        .catch(err => res.status(500).json(err));
};

module.exports = {
    getAll,
    create,
    update,
    remove
};