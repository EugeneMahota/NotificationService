const mongoose = require('mongoose');
const User = mongoose.model('User');
const bCrypt = require('bcrypt');
const parserError = require('../helpers/parserError');

const saltRounds = 10;

const getAll = (req, res) => {
    User.find()
        .exec()
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err))
};

const create = (req, res) => {
    const {email, name, password} = req.body;

    var salt = bCrypt.genSaltSync(saltRounds);
    var hash = bCrypt.hashSync(password, saltRounds);

    User.create({email: email.toLowerCase(), name: name, password: hash})
        .then(user => res.json(parserError(user)))
        .catch(err => res.status(500).json(err));
};

const update = (req, res) => {
    const {id, email, name} = req.body;

    User.findOneAndUpdate({_id: id}, {email: email, name: name})
        .exec()
        .then(user => res.json(parserError(user)))
        .catch(err => res.status(500).json(err));
};

const remove = (req, res) => {
    User.deleteOne({_id: req.params.id})
        .exec()
        .then(user => res.json(parserError(user)))
        .catch(err => res.status(500).json(err));
};

module.exports = {
    getAll,
    create,
    update,
    remove
};