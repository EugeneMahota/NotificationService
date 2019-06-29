const auth = require('../app/controllers/auth');
const user = require('../app/controllers/user');
const category = require('../app/controllers/category');
const service = require('../app/controllers/service');
const order = require('../app/controllers/order');
const categoryProduct = require('../app/controllers/categoryProduct');
const product = require('../app/controllers/product');

const authMiddleware = require('../app/middleware/auth');
const uploadService = require('../app/middleware/uploadService');
const uploadProduct = require('../app/middleware/uploadProduct');

module.exports = (app) => {
    app.post('/login', auth.signIn);
    app.post('/refresh-tokens', auth.refreshTokens);

    app.get('/user', authMiddleware, user.getAll);
    app.post('/user', authMiddleware, user.create);
    app.put('/user', authMiddleware, user.update);
    app.delete('/user/:id', authMiddleware, user.remove);

    app.get('/category', authMiddleware, category.getAll);
    app.post('/category', authMiddleware, category.create);
    app.put('/category', authMiddleware, category.update);
    app.delete('/category/:id', authMiddleware, category.remove);

    app.get('/service', authMiddleware, service.getAll);
    app.post('/service', authMiddleware, uploadService.single('image'), service.create);
    app.put('/service', authMiddleware, uploadService.single('image'), service.update);
    app.delete('/service/:id', authMiddleware, service.remove);

    app.get('/order', authMiddleware, order.getAll);
    app.get('/order/:telephone', authMiddleware, order.getByTelephone);
    app.post('/order', authMiddleware, order.create);
    app.put('/order', authMiddleware, order.update);
    app.delete('/order/:id', authMiddleware, order.remove);

    app.get('/category-product', authMiddleware, categoryProduct.getAll);
    app.post('/category-product', authMiddleware, categoryProduct.create);
    app.put('/category-product', authMiddleware, categoryProduct.update);
    app.delete('/category-product/:id', authMiddleware, categoryProduct.remove);

    app.get('/product', authMiddleware, product.getAll);
    app.post('/product', authMiddleware, uploadProduct.single('image'), product.create);
    app.put('/product', authMiddleware, uploadProduct.single('image'), product.update);
    app.delete('/product/:id', authMiddleware, product.remove);
};