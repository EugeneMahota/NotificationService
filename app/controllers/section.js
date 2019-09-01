const mongoose = require('mongoose');
const Section = mongoose.model('Section');
const parserError = require('../helpers/parserError');

const getAll = (req, res) =>
    Section.find()
        .sort([['number', 1]])
        .exec()
        .then(section => res.json(section))
        .catch(err => res.status(500).json(err));

const create = (req, res) =>
    Section.create(req.body)
        .then(section => res.json(parserError(section)))
        .catch(err => res.status(500).json(err));

const update = (req, res) =>
    Section.findOneAndUpdate({_id: req.body.id}, req.body)
        .exec()
        .then(section => res.json(parserError(section)))
        .catch(err => res.status(500).json(err));

const remove = (req, res) =>
    Section.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(section => res.json(parserError(section)))
        .catch(err => res.status(500).json(err));

module.exports = {
    getAll,
    create,
    update,
    remove
};