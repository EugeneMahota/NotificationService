const mongoose = require('mongoose');
const ConfigApp = mongoose.model('ConfigApp');
const parserError = require('../helpers/parserError');

const {baseHref} = require('../../config/app');

const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const getAll = (req, res) =>
    ConfigApp.find()
        .exec()
        .then(config => res.json(config))
        .catch(err => res.json(err));

const create = (req, res) => {
    if (req.files) {
        req.body.logoLight = baseHref + '/config/' + req.files.logoLight[0].filename;
        req.body.logoDark = baseHref + '/config/' + req.files.logoDark[0].filename;
        req.body.imageHeader = baseHref + '/config/' + req.files.imageHeader[0].filename;
    } else {
        req.body.logoLight = '';
        req.body.logoDark = '';
        req.body.imageHeader = '';
    }

    ConfigApp.create(req.body)
        .then(config => res.json(parserError(config)))
        .catch(err => {
            deleteLogoLight(req.body);
            deleteLogoDark(req.body);
            deleteImageHeader(req.body);
            res.json(err)
        });
};

const update = (req, res) => {
    if (req.files.logoLight) {
        req.body.logoLight = baseHref + '/config/' + req.files.logoLight[0].filename;
    }
    if (req.files.logoDark) {
        req.body.logoDark = baseHref + '/config/' + req.files.logoDark[0].filename;
    }
    if (req.files.imageHeader) {
        req.body.imageHeader = baseHref + '/config/' + req.files.imageHeader[0].filename;
    }

    ConfigApp.findOneAndUpdate({_id: req.body.id}, req.body)
        .exec()
        .then(config => {
            if (req.files.logoLight) deleteLogoLight(config);
            if (req.files.logoDark) deleteLogoDark(config);
            if (req.files.imageHeader) deleteImageHeader(config);
            res.json(parserError(config))
        })
        .catch(err => {
            deleteLogoLight(req.body);
            deleteLogoDark(req.body);
            deleteImageHeader(req.body);
            res.json(err)
        });
};

const remove = (req, res) =>
    ConfigApp.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(config => {
            deleteLogoLight(config);
            deleteLogoDark(config);
            deleteImageHeader(config);
            res.json(parserError(config))
        })
        .catch(err => res.json(err));


function deleteLogoLight(config) {
    const image = config.logoLight.replace(baseHref + '/config/', 'public/config/');
    unlinkAsync(image);
}
function deleteLogoDark(config) {
    const image = config.logoDark.replace(baseHref + '/config/', 'public/config/');
    unlinkAsync(image);
}
function deleteImageHeader(config) {
    const image = config.imageHeader.replace(baseHref + '/config/', 'public/config/');
    unlinkAsync(image);
}

module.exports = {
    getAll,
    create,
    update,
    remove
};