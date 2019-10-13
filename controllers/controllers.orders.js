const ordersModel = require("../models/models.orders");

const createOrder = (req, res, next) => {
    ordersModel
        .createOrder(req)
        .then(data => {
            console.log(this, data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

const getActiveOrdersByAccountId = (req, res, next) => {
    ordersModel
        .getActiveOrdersByAccountId(req)
        .then(data => {
            console.log(this, data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

const getOrderHistoryByAccountId = (req, res, next) => {
    ordersModel
        .getOrderHistoryByAccountId(req)
        .then(data => {
            console.log(this, data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

module.exports = {
    createOrder,
    getActiveOrdersByAccountId,
    getOrderHistoryByAccountId
};
