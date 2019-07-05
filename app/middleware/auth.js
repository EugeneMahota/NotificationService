const jwt = require('jsonwebtoken');
const {secret} = require('../../config/app').jwt;

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        res.status(401).json({msg: 'Токен не найден!'});
    } else {
        const token = authHeader.replace('Bearer ', '');

        try {
            const payload = jwt.verify(token, secret);

            if (payload.type !== 'access') {
                res.status(401).json({msg: 'Неверный токен!'});
            }
            next();
        } catch (err) {
            res.status(401).json({msg: 'Ошибка авторизации!'})
        }
    }
};