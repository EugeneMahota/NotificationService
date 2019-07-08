const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt');
const {secret} = require('../../config/app').jwt;
const authHelper = require('../helpers/auth');

const User = mongoose.model('User');
const Token = mongoose.model('Token');

const updateTokens = (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
        .then(() => ({
            accessToken,
            refreshToken: refreshToken.token
        }));
};

const signIn = (req, res) => {
    const {email, password} = req.body;

    User.findOne({email: email.toLowerCase()})
        .exec()
        .then(user => {

            if (!user) {
                res.status(401).json('Пользователь не найден!')
            }

            const isValid = bCrypt.compareSync(password, user.password);

            if (isValid) {
                updateTokens(user._id).then(tokens => res.json(tokens));
            } else {
                res.status(401).json('Пароль введен неверно!')
            }
        })
        .catch(err => res.status(500).json(err));
};

const refreshTokens = (req, res) => {
    const {refreshToken} = req.body;

    let payload;
    try {
        payload = jwt.verify(refreshToken, secret);
        if (payload.type !== 'refresh') {
            res.status(400).json('Неверный токен!');
        }
        Token.findOne({tokenId: payload.id})
            .exec()
            .then(token => {
                if (token === null) {
                    throw new Error('Неверный токен!');
                }

                return updateTokens(token.userId);
            })
            .then(tokens => res.json(tokens))
            .catch(err => res.status(400).json(err));

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).json('Неверный токен!');
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(400).json('Неверный токен!');
        }
    }
};

module.exports = {
    signIn,
    refreshTokens
};