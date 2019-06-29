const mongoose = require('mongoose');
const CategoryProduct = mongoose.model('CategoryProduct');

const getAll = (req, res) => {
    CategoryProduct.find()
        .populate('product')
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));
};

const create = (req, res) => {
    CategoryProduct.create(req.body)
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err))
};

const update = (req, res) => {
    const category = req.body;
    CategoryProduct.updateOne({_id: category.id} ,category)
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));
};

const remove = (req, res) => {
    CategoryProduct.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));
};

module.exports = {
    getAll,
    create,
    update,
    remove
};