const auth = require('../app/controllers/auth');
const user = require('../app/controllers/user');
const category = require('../app/controllers/category');
const service = require('../app/controllers/service');
const order = require('../app/controllers/order');
const categoryProduct = require('../app/controllers/categoryProduct');
const product = require('../app/controllers/product');
const request = require('../app/controllers/request');
const report = require('../app/controllers/report');
const sale = require('../app/controllers/sale');
const address = require('../app/controllers/address');
const section = require('../app/controllers/section');
const configApp = require('../app/controllers/configApp');

const authMiddleware = require('../app/middleware/auth');
const uploadService = require('../app/middleware/uploadService');
const uploadProduct = require('../app/middleware/uploadProduct');
const uploadCategory = require('../app/middleware/uploadCategory');
const uploadConfig = require('../app/middleware/uploadConfig');

module.exports = (app) => {
    app.post('/login', auth.signIn);
    app.post('/refresh-tokens', auth.refreshTokens);

    app.get('/user', authMiddleware, user.getAll);
    app.get('/profile', authMiddleware, user.getUser);
    app.post('/user', authMiddleware, user.create);
    app.put('/user', authMiddleware, user.update);
    app.delete('/user/:id', authMiddleware, user.remove);

    app.get('/category-and-service', category.getCategoryAndService);
    app.get('/category', category.getCategoryAndService);
    app.get('/category/:section', category.getCategoryBySection);
    app.post('/category', authMiddleware, uploadCategory.single('image'), category.create);
    app.put('/category', authMiddleware, uploadCategory.single('image'), category.update);
    app.delete('/category/:id', authMiddleware, category.remove);

    app.get('/service', service.getAll);
    app.post('/service', authMiddleware, uploadService.single('image'), service.create);
    app.put('/service', authMiddleware, uploadService.single('image'), service.update);
    app.delete('/service/:id', authMiddleware, service.remove);

    app.get('/order', authMiddleware, order.getAll);
    app.get('/order/:telephone', order.getByTelephone);
    app.post('/order', order.create);
    app.put('/order', authMiddleware, order.update);
    app.delete('/order/:id', authMiddleware, order.remove);
    app.ws('/', order.ws);

    app.get('/category-product', categoryProduct.getAll);
    app.get('/category-product-list', authMiddleware, categoryProduct.getCategory);
    app.post('/category-product', authMiddleware, categoryProduct.create);
    app.put('/category-product', authMiddleware, categoryProduct.update);
    app.delete('/category-product/:id', authMiddleware, categoryProduct.remove);

    app.get('/product', product.getAll);
    app.put('/product/all', authMiddleware, product.updateMany);
    app.post('/product', authMiddleware, uploadProduct.single('image'), product.create);
    app.put('/product', authMiddleware, uploadProduct.single('image'), product.update);
    app.delete('/product/:id', authMiddleware, product.remove);

    app.get('/request', authMiddleware, request.getAll);
    app.post('/request', request.create);
    app.put('/request', authMiddleware, request.update);
    app.delete('/request/:id', authMiddleware, request.remove);

    app.get('/report', authMiddleware, report.getReportForOrder);
    app.post('/report', authMiddleware, report.getReportForOrderCharts);

    app.get('/sale', authMiddleware, sale.getAllSale);
    app.get('/sale/:telephone', sale.getSaleByTelephone);
    app.post('/sale', sale.createSale);
    app.put('/sale', authMiddleware, sale.updateSale);
    app.delete('/sale/:id', authMiddleware, sale.removeSale);

    app.get('/address', address.getAll);
    app.post('/address', authMiddleware, address.create);
    app.put('/address', authMiddleware, address.update);
    app.delete('/address/:id', authMiddleware, address.remove);

    app.get('/section', section.getAll);
    app.post('/section', authMiddleware, section.create);
    app.put('/section', authMiddleware, section.update);
    app.delete('/section/:id', authMiddleware, section.remove);

    app.get('/config', configApp.getAll);
    app.post('/config', authMiddleware, uploadConfig.fields([
        {name: 'logoLight', maxCount: 1},
        {name: 'logoDark', maxCount: 1},
        {name: 'imageHeader', maxCount: 1}
        ]), configApp.create);
    app.put('/config', authMiddleware, uploadConfig.fields([
        {name: 'logoLight', maxCount: 1},
        {name: 'logoDark', maxCount: 1},
        {name: 'imageHeader', maxCount: 1}
    ]), configApp.update);
    app.delete('/config/:id', authMiddleware, configApp.remove);
};