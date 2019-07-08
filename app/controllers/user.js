const mongoose = require('mongoose');
const User = mongoose.model('User');
const bCrypt = require('bcrypt');
const parserError = require('../helpers/parserError');

const saltRounds = 10;

const jwt = require('jsonwebtoken');
const {secret} = require('../../config/app').jwt;

const getAll = (req, res) => {
    User.find()
        .exec()
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err))
};

const getUser = (req, res) => {
    const token = req.get('Authorization');
    const user = jwt.verify(token, secret);

    User.findOne({_id: user.userId})
        .exec()
        .then(user => {
            if (user._id) {
                res.json(user);
            } else {
                res.status(500).json('Пользователь не найден!');
            }
        })
        .catch(err => res.status(500).json(err));
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

    const accessToken = req.get('Authorization');
    const verify = jwt.verify(accessToken, secret);

    User.findOne({_id: req.params.id})
        .exec()
        .then(user => {
            if (user._id.toString() !== verify.userId) {
                return User.findOneAndRemove({_id: req.params.id});
            } else {
                res.status(500).json('Невозможно удалить пользователя под которым вошел!')
            }
        })
        .then(user => res.json(parserError(user)))
        .catch(err => res.status(500).json(err));
};

module.exports = {
    getAll,
    getUser,
    create,
    update,
    remove
};