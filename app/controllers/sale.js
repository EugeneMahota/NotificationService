const mongoose = require('mongoose');

const SaleProduct = mongoose.model('SaleProduct');
const Sale = mongoose.model('Sale');
const Product = mongoose.model('Product');

const parserError = require('../helpers/parserError');

getAllSale = (req, res) => {
    const dateStart = new Date(+new Date(req.query.dateStart) - 10800000);
    const dateEnd = new Date(+new Date(req.query.dateEnd) - 10800000);

    Sale.find()
        .populate('product')
        .populate({path: 'product', populate: {path: 'product'}})
        .where('date').gt(dateStart).lt(dateEnd)
        .sort([['date', -1]])
        .exec()
        .then(sale => res.json(sale))
        .catch(err => res.status(500).json(err))
};

const getSaleByTelephone = (req, res) => {
    Sale.find({telephone: req.params.telephone})
        .populate('product')
        .populate({path: 'product', populate: {path: 'product'}})
        .sort([['date', -1]])
        .exec()
        .then(sale => res.json(sale))
        .catch(err => res.json(err))
};

const createSale = (req, res) => {
    const newSale = req.body;
    const listSaleProduct = [];

    newSale.product.forEach(function (data) {
        SaleProduct.create({product: data.id, quantity: data.quantity})
            .then(saleProduct => {
                listSaleProduct.push(saleProduct._id);
                if (newSale.product.length === listSaleProduct.length) {
                    Sale.create({
                        name: newSale.name,
                        telephone: newSale.telephone,
                        info: newSale.info,
                        status: 'new',
                        date: new Date(),
                        product: listSaleProduct
                    })
                        .then(sale => res.json(parserError(sale)))
                        .catch(err => res.status(500).json(err))
                }
            })
            .catch(err => res.status(500).json(err))
    });
};

const updateSale = (req, res) => {
    const newSale = req.body;
    var countProduct = 0;

    Sale.findOneAndUpdate({_id: newSale.id}, newSale)
        .populate('product')
        .exec()
        .then(sale => {
            if (newSale.status === 'success' && sale.status !== 'success') {
                sale.product.forEach(function (data) {
                    Product.update({_id: data.product}, {$inc: {quantity: -data.quantity}})
                        .exec()
                        .then(product => {
                            countProduct++;
                            if (countProduct === sale.product.length) {
                                res.json({status: 'Ok', msg: ''})
                            }
                        })
                        .catch(err => res.status(500).json(err))
                })
            } else if (newSale.status !== 'success' && sale.status === 'success') {
                sale.product.forEach(function (data) {
                    Product.update({_id: data.product}, {$inc: {quantity: data.quantity}})
                        .exec()
                        .then(product => {
                            countProduct++;
                            if (countProduct === sale.product.length) {
                                res.json({status: 'Ok', msg: ''})
                            }
                        })
                        .catch(err => res.status(500).json(err))
                })
            } else {
                res.json(parserError(sale));
            }
        })
        .catch(err => res.status(500).json(err))

};

const removeSale = (req, res) => {
    const saleId = req.params.id;
    const listDeleteProduct = [];

    Sale.findOneAndDelete({_id: saleId})
        .populate('product')
        .exec()
        .then(sale => {
            if (sale.status === 'success') {
                sale.product.forEach(function (data) {
                    Product.update({_id: data.product}, {$inc: {quantity: data.quantity}})
                        .exec()
                        .then(product => {
                            listDeleteProduct.push(data._id);
                            if (listDeleteProduct.length === sale.product.length) {
                                removeSaleProduct(listDeleteProduct);
                                res.json({status: 'Ok', msg: ''})
                            }
                        })
                        .catch(err => res.status(500).json(err))
                })
            } else {
                sale.product.forEach(function (data) {
                    listDeleteProduct.push(data._id);
                    removeSaleProduct(listDeleteProduct);
                });
                res.json(parserError(sale));
            }
        })
        .catch(err => res.status(500).json(err));
};

const removeSaleProduct = (listProduct) => {
    SaleProduct.deleteMany({_id: {$in: listProduct}})
        .exec()
        .then()
        .catch()
};

module.exports = {
    createSale,
    getSaleByTelephone,
    getAllSale,
    updateSale,
    removeSale
};