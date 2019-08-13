const mongoose = require('mongoose');
const Address = mongoose.model('Address');

const parserError = require('../helpers/parserError');

const getAll = (req, res) =>
    Address.find()
        .exec()
        .then(address => res.json(address))
        .catch(err => res.status(500).json(err));

const create = (req, res) =>
    Address.create(req.body)
        .then(address => res.json(parserError(address)))
        .catch(err => res.status(500).json(err));

const update = (req, res) =>
    Address.findOneAndUpdate({_id: req.body.id}, req.body)
        .exec()
        .then(address => res.json(parserError(address)))
        .catch(err => res.status(500).json(err));

const remove = (req, res) =>
    Address.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(address => res.json(parserError(address)))
        .catch(err => res.status(500).json(err));

module.exports = {
    getAll,
    create,
    update,
    remove,
};