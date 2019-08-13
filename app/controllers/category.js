const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const parserError = require('../helpers/parserError');

const {baseHref} = require('../../config/app');

const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const getCategoryBySection = (req, res) => {
    Category.find({section: req.params.section})
        .populate('service')
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));
};

const getCategoryAndService = (req, res) =>
    Category.find()
        .populate('service')
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));

const getCategory = (req, res) => {
    Category.find()
        .exec()
        .then(category => res.json(category))
        .catch(err => res.status(500).json(err));
};


const create = (req, res) => {
    if (req.file) {
        req.body.image = baseHref + '/category-image/' + req.file.filename;
    } else {
        req.body.image = '';
    }

    console.log(req.body);
    Category.create(req.body)
        .then(category => res.json(parserError(category)))
        .catch(err => res.status(500).json(err));
};


const update = (req, res) => {
    if (req.file) {
        req.body.image = baseHref + '/category-image/' + req.file.filename;
    }
    const newCategory = req.body;

    Category.findOneAndUpdate({_id: req.body.id}, newCategory)
        .exec()
        .then(category => {
            if (req.body.image) {
                deleteImage(category);
            }
            res.json(parserError(category))
        })
        .catch(err => res.status(500).json(err));
};


const remove = (req, res) => {
    Category.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(category => {
            deleteImage(category);
            res.json(parserError(category))
        })
        .catch(err => res.status(500).json(err));
};


function deleteImage(category) {
    const image = category.image.replace(baseHref + '/category-image/', 'public/category-image/');
    unlinkAsync(image);
}

module.exports = {
    getCategoryBySection,
    getCategoryAndService,
    getCategory,
    create,
    update,
    remove
};