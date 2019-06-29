const mongoose = require('mongoose');
const Service = mongoose.model('Service');
const Category = mongoose.model('Category');

const {baseHref} = require('../../config/app');

const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const getAll = (req, res) => {
    Service.find()
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
            res.json(category);
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
            res.json(category);
        })
        .catch(err => res.status(500).json(err));
};

const remove = (req, res) => {
    Service.findOneAndRemove({_id: req.params.id})
        .exec()
        .then(service => {
            deleteImage(service);
            return Category.findOneAndUpdate({_id: service.category}, {$pull: {service: service._id}})
        })
        .then(category => res.json(category))
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