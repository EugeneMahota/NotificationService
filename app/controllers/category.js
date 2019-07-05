const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const parserError = require('../helpers/parserError');

const getAll = (req, res) =>
    Category.find()
        .populate('service')
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));


const create = (req, res) =>
    Category.create(req.body)
        .then(category => res.json(parserError(category)))
        .catch(err => res.status(500).json(err));


const update = (req, res) => {
    const category = req.body;
    Category.findOneAndUpdate({_id: category.id}, {name: category.name})
        .exec()
        .then(category => res.json(parserError(category)))
        .catch(err => res.status(500).json(err));
};


const remove = (req, res) =>
    Category.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(category => res.json(parserError(category)))
        .catch(err => res.status(500).json(err));

module.exports = {
    getAll,
    create,
    update,
    remove
};