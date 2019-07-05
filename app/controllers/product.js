const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const CategoryProduct = mongoose.model('CategoryProduct');
const parserError = require('../helpers/parserError');

const {baseHref} = require('../../config/app');

const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const getAll = (req, res) => {
    Product.find()
        .exec()
        .then(product => res.json(product))
        .catch(err => res.json(err));
};

const create = (req, res) => {
    if (req.file) {
        req.body.image = baseHref + '/product-image/' + req.file.filename;
    }

    Product.create(req.body)
        .then(product => {
            return CategoryProduct.findOneAndUpdate({_id: product.category}, {$push: {product: product._id}})
        })
        .then(category => res.json(parserError(category)))
        .catch(err => res.json(err));
};

const update = (req, res) => {
    if (req.file) {
        req.body.image = baseHref + '/product-image/' + req.file.filename;
    }

    const newProduct = req.body;
    Product.findOneAndUpdate({_id: newProduct.id}, newProduct)
        .exec()
        .then(product => {
            if (req.body.image) {
                deleteImage(product);
            }
            return CategoryProduct.findOneAndUpdate({_id: product.category}, {$pull: {product: product._id}});
        })
        .then(category => {
            return CategoryProduct.findOneAndUpdate({_id: newProduct.category}, {$push: {product: newProduct.id}})
        })
        .then(category => res.json(parserError(category)))
        .catch(err => res.json(err));
};

const remove = (req, res) => {
    Product.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(product => {
            deleteImage(product);
            return CategoryProduct.findOneAndUpdate({_id: product.category}, {$pull: {product: product._id}});
        })
        .then(category => res.json(parserError(category)))
        .catch(err => res.json(err));
};

const deleteImage = (product) => {
    const image = product.image.replace(baseHref + '/product-image/', 'public/product-image/');
    unlinkAsync(image);
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
