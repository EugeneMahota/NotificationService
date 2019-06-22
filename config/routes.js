const auth = require('../app/controllers/auth');
const service = require('../app/controllers/service');
const user = require('../app/controllers/user');

const authMiddleware = require('../app/middleware/auth');

module.exports = (app) => {
    app.post('/login', auth.signIn);
    app.post('/refresh-tokens', auth.refreshTokens);

    app.get('/service', authMiddleware, service.getAll);
    app.post('/service', authMiddleware, service.create);
    app.put('/service', authMiddleware, service.update);
    app.delete('/service', authMiddleware, service.remove);

    app.get('/user', authMiddleware, user.getAll);
    app.post('/user', authMiddleware, user.create);
    app.put('/user', authMiddleware, user.update);
    app.delete('/user/:id', authMiddleware, user.remove);
};