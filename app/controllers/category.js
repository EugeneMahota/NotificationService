const mongoose = require('mongoose');
const Category = mongoose.model('Category');

const getAll = (req, res) =>
    Category.find()
        .populate('service')
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));


const create = (req, res) =>
    Category.create(req.body)
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));


const update = (req, res) =>
    Category.update(req.body)
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));


const remove = (req, res) =>
    Category.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));

module.exports = {
    getAll,
    create,
    update,
    remove
};