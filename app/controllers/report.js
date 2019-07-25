const mongoose = require('mongoose');
const Order = mongoose.model('Order');

const getReportForOrder = (req, res) => {
    const dateStart = new Date(+new Date(req.query.dateStart) - 10800000);
    const dateEnd = new Date(+new Date(req.query.dateEnd) - 10800000);

    Order.find({status: 'success'})
        .populate('service')
        .populate({path: 'service', populate: {path: 'category'}})
        .where('date').gt(dateStart).lt(dateEnd)
        .sort([['date', -1]])
        .exec()
        .then(order => res.json(order))
        .catch(err => res.status(500).json(err))
};

const getReportForOrderCharts = (req, res) => {
    var listDate = req.body.date;
    var listReport = [];

    for (let i = 0; listDate.length > i; i++) {

        var dateStart = new Date(+new Date(listDate[i].dateStart) - 10800000);
        var dateEnd = new Date(+new Date(listDate[i].dateEnd) - 10800000);
        console.log(dateStart, dateEnd);
        Order.find({status: 'success'})
            .populate('service')
            .populate({path: 'service', populate: {path: 'category'}})
            .where('date').gt(dateStart).lt(dateEnd)
            .exec()
            .then(order => {
                listReport.push({
                    dateStart: dateStart.toString(),
                    dateEnd: dateEnd.toString(),
                    order: order
                });
            })
            .catch(err => res.status(500).json(err));
    }

    res.json(listReport);
};

module.exports = {
    getReportForOrder,
    getReportForOrderCharts
};