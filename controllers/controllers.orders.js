const ordersModel = require("../models/models.orders");
const accountModel = require("../models/models.account");

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

const closeOrder = (req, res, next) => {
    accountModel
        .getAccountInfoByAccountId(req.auth.account_uid)
        .then(account => {
            // ordersModel.getOrderById(req.body.order_uid).then(order => {
            // res.status(200).send(order);
            // });
            ordersModel.closeOrder(req.body.order_uid).then(response => res.status(200).send(response));
        })
        .catch(err => next(err));
};

const getActiveOrdersByAccountId = (req, res, next) => {
    ordersModel
        .getActiveOrdersByAccountId(req)
        .then(data => {
            // console.log(this, data);
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
    closeOrder,
    getActiveOrdersByAccountId,
    getOrderHistoryByAccountId
};
