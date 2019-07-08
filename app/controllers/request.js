const mongoose = require('mongoose');
const Request = mongoose.model('Request');
const parserError = require('../helpers/parserError');

const getAll = (req, res) => {
    Request.find()
        .where('date').gt(req.query.dateStart).lt(req.query.dateEnd)
        .sort([['date', -1]])
        .exec()
        .then(request => res.json(request))
        .catch(err => res.status(500).json(err))
};

const create = (req, res) => {
    req.body.date = new Date();
    req.body.status = 'new';
    Request.create(req.body)
        .then(request => res.json(parserError(request)))
        .catch(err => res.status(500).json(err))
};

const update = (req, res) => {
    Request.findOneAndUpdate({_id: req.body.id}, req.body)
        .exec()
        .then(request => res.json(parserError(request)))
        .catch(err => res.status(500).json(err))
};

const remove = (req, res) => {
    Request.findOneAndRemove({_id: req.params.id})
        .exec()
        .then(request => res.json(parserError(request)))
        .catch(err => res.status(500).json(err))
};

module.exports = {
    getAll,
    create,
    update,
    remove
};