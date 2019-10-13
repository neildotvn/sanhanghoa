const pool = require("../db/pool");
const ordersQueries = require("../db/queries/queries.orders");
const _ = require("lodash");

const orderFields = () => {
    return [
        "exchange",
        "order_type",
        "order_status",
        "volume",
        "placing_price",
        "take_profit_price",
        "stop_loss_price"
    ];
};

const getActiveOrdersByAccountId = req => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                client
                    .query(
                        ordersQueries.getActiveOrdersByAccountId(
                            req.auth.account_uid
                        )
                    )
                    .then(
                        data => {
                            const orders = data.rows;
                            resolve(
                                orders.map(order => _.omitBy(order, _.isNull))
                            );
                        },
                        err => {
                            reject(err);
                        }
                    )
                    .finally(() => client.release());
            })
            .catch(err => reject(err));
    });
};

const getOrderHistoryByAccountId = req => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                client
                    .query(
                        ordersQueries.getOrderHistoryByAccountId(
                            req.auth.account_uid
                        )
                    )
                    .then(
                        data => {
                            const orders = data.rows;
                            resolve(
                                orders.map(order => _.omitBy(order, _.isNull))
                            );
                        },
                        err => {
                            reject(err);
                        }
                    )
                    .finally(() => client.release());
            })
            .catch(err => reject(err));
    });
};

const createOrder = req => {
    const orderInfo = _.values(_.pick(req.body, orderFields()));
    orderInfo.push(req.auth.account_uid);

    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                client
                    .query(ordersQueries.createOrder(orderInfo))
                    .then(
                        data => {
                            const order = data.rows[0];
                            resolve(_.omitBy(order, _.isNull));
                        },
                        err => {
                            console.log(err);
                            reject(err);
                        }
                    )
                    .finally(() => client.release());
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

const updateOrder = req => {
    const body = req.body;
};

module.exports = {
    orderField: orderFields,
    createOrder,
    updateOrder,
    getActiveOrdersByAccountId,
    getOrderHistoryByAccountId
};
