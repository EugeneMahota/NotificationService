const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const {tokens, secret} = require('../../config/app').jwt;

const mongoose = require('mongoose');
const Token = mongoose.model('Token');

const generateAccessToken = (userId, user) => {
    const payload = {
        userId,
        user,
        type: tokens.access.type
    };
    const options = {expiresIn: tokens.access.expiresIn};

    return jwt.sign(payload, secret, options);
};

const generateRefreshToken = () => {
    const payload = {
        id: uuid(),
        type: tokens.refresh.type
    };
    const options = {expiresIn: tokens.refresh.expiresIn};

    return {
        id: payload.id,
        token: jwt.sign(payload, secret, options)
    };
};

const replaceDbRefreshToken = (tokenId, userId) =>
    Token.findOneAndDelete({userId})
        .exec()
        .then(() => Token.create({tokenId, userId}));


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken
};


