const mongoose = require('mongoose');
const Service = mongoose.model('Service');
const Category = mongoose.model('Category');
const Order = mongoose.model('Order');
const parserError = require('../helpers/parserError');

const {baseHref} = require('../../config/app');

const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const getAll = (req, res) => {
    Service.find()
        .populate('category')
        .exec()
        .then(service => res.json(service))
        .catch(err => res.status(500).json(err));
};

const create = (req, res) => {
    if (req.file) {
        req.body.image = baseHref + '/service-image/' + req.file.filename;
    } else {
        req.body.image = '';
    }


    Service.create(req.body)
        .then(service => {
            return Category.findOneAndUpdate({_id: service.category}, {$push: {service: service._id}});
        })
        .then(category => {
            res.json(parserError(category));
        })
        .catch(err => res.status(500).json(err));

};

const update = (req, res) => {
    if (req.file) {
        req.body.image = baseHref + '/service-image/' + req.file.filename;
    }

    const newService = req.body;

    Service.findOneAndUpdate({_id: newService.id}, newService)
        .exec()
        .then(service => {
            if (req.body.image) {
                deleteImage(service);
            }
            return Category.findOneAndUpdate({_id: service.category}, {$pull: {service: service._id}});
        })
        .then(category => {
            return Category.findOneAndUpdate({_id: newService.category}, {$push: {service: newService.id}});
        })
        .then(category => {
            res.json(parserError(category));
        })
        .catch(err => res.status(500).json(err));
};

const remove = (req, res) => {
    Service.findOne({_id: req.params.id})
        .exec()
        .then(service => {
            return Order.find({service: service._id});
        })
        .then(order => {
            if (order.length > 0) {
                res.status(500).json('Запрет на удаление! Имеются привязанные записи.')
            } else {
                return Service.findOneAndRemove({_id: req.params.id});
            }
        })
        .then(service => {
            deleteImage(service);
            return Category.findOneAndUpdate({_id: service.category}, {$pull: {service: service._id}})
        })
        .then(category => res.json(parserError(category)))
        .catch(err => res.status(500).json(err));
};

function deleteImage(service) {
    const image = service.image.replace(baseHref + '/service-image/', 'public/service-image/');
    unlinkAsync(image);
}

module.exports = {
    getAll,
    create,
    update,
    remove
};