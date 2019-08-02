const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Request = mongoose.model('Request');
const Service = mongoose.model('Service');

const parserError = require('../helpers/parserError');

var wsClients = [];
var countNewOrder = 0;
var countNewRequest = 0;

const getAll = (req, res) => {
    const dateStart = new Date(+new Date(req.query.dateStart) - 10800000);
    const dateEnd = new Date(+new Date(req.query.dateEnd) - 10800000);

    Order.find()
        .populate('service')
        .populate({path: 'service', populate: {path: 'category'}})
        .where('date').gt(dateStart).lt(dateEnd)
        .sort([['date', -1]])
        .exec()
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
};


const getByTelephone = (req, res) => {
    Order.find({telephone: req.params.telephone})
        .populate('service')
        .populate({path: 'service', populate: {path: 'category'}})
        .sort([['date', -1]])
        .exec()
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err));
};

const create = (req, res) => {
    var order = req.body;

    order.date = new Date();
    order.status = 'new';


    console.log(order);
    Service.findOne({_id: order.service})
        .exec()
        .then(service => {
            order.price = service.price;
            return Order.create(order);
        })
        .then(order => res.json(parserError(order)))
        .catch(err => res.status(500).json(err));
};

const update = (req, res) => {
    const order = req.body;

    Order.findOneAndUpdate({_id: order.id}, order)
        .exec()
        .then(order => res.json(parserError(order)))
        .catch(err => res.status(500).json(err));
};

const remove = (req, res) => {
    Order.findOneAndDelete({_id: req.params.id})
        .exec()
        .then(order => res.json(parserError(order)))
        .catch(err => res.status(500).json(err));
};

const ws = (ws, req) => {

    wsClients.push(ws);

    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        var dateEnd = new Date();
        var dateStart = new Date().setMonth(dateEnd.getMonth() - 2);

        if (data.event === 'addOrder') {
            countNewOrder++;
            wsClients.forEach(clients => {
                if (clients.readyState === 1) {
                    clients.send(JSON.stringify({event: 'updateOrder', data: countNewOrder}))
                }
            });
        }
        if (data.event === 'addRequest') {
            countNewRequest++;
            wsClients.forEach(clients => {
                if (clients.readyState === 1) {
                    clients.send(JSON.stringify({event: 'updateRequest', data: countNewRequest}))
                }
            });
        }

        if (data.event === 'checkOrder') {
            Order.find({status: 'new'})
                .where('date').gt(dateStart).lt(dateEnd)
                .exec()
                .then(order => {
                    countNewOrder = order.length;
                    ws.send({event: 'updateOrder', data: countNewOrder});
                })
                .catch(err => ws.send(JSON.stringify({event: 'updateOrder', data: countNewOrder})));
        }

        if (data.event === 'checkRequest') {
            Request.find({status: 'new'})
                .where('date').gt(dateStart).lt(dateEnd)
                .exec()
                .then(request => {
                    countNewRequest = request.length;
                    ws.send({event: 'updateRequest', data: countNewRequest});
                })
                .catch(err => ws.send(JSON.stringify({event: 'updateRequest', data: countNewRequest})));
        }
    });

    ws.on('close', () => {
        wsClients.splice(wsClients.indexOf(ws), 1);
    });
};

module.exports = {
    getAll,
    getByTelephone,
    create,
    update,
    remove,
    ws
};