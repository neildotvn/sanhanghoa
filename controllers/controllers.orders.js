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

const getOrdersByAccountId = (req, res, next) => {
    ordersModel
        .getOrdersByAccountId(req)
        .then(data => {
            console.log(this, data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

module.exports = { createOrder, getOrdersByAccountId };
