const pool = require("../db/pool");
const Redis = require("ioredis");
const redis = new Redis();
const sub = new Redis();
const ordersQueries = require("../db/queries/queries.orders");
const accountQueries = require("../db/queries/queries.account");
const _ = require("lodash");

const orderFields = () => {
    return [
        "product",
        "exchange",
        "order_type",
        "order_status",
        "volume",
        "placing_price",
        "take_profit_price",
        "stop_loss_price"
    ];
};

const getAllActiveOrders = () => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                client
                    .query("SELECT * FROM orders WHERE order_status=0")
                    .then(
                        data => {
                            resolve(data.rows);
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

const getOrderById = order_uid => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                client
                    .query(ordersQueries.getOrderById(order_uid))
                    .then(
                        data => {
                            const order = data.rows[0];
                            resolve(order);
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

const closeOrder = order_uid => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                client
                    .query(ordersQueries.getOrderById(order_uid))
                    .then(
                        orderResult => {
                            const order = orderResult.rows[0];
                            redis.get("prices").then(
                                prices => {
                                    const closingPrice = getRowDataWithProductAndExchange(
                                        JSON.parse(prices),
                                        order.product,
                                        order.exchange
                                    )[1];
                                    client
                                        .query(
                                            ordersQueries.closeOrderById(
                                                order_uid,
                                                closingPrice
                                            )
                                        )
                                        .then(
                                            data => {
                                                resolve("success");
                                            },
                                            err => {
                                                console.log(err);
                                                reject(err);
                                            }
                                        );
                                },
                                err => console.log(err)
                            );
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

const processOrdersWhenPricesUpdated = prices => {
    // return new Promise((resolve, reject) => {
    //     pool.connect()
    //         .then(client => {
    //             client
    //                 .query("SELECT * FROM orders WHERE order_status=0")
    //                 .then(
    //                     data => {
    //                         // resolve(data.rows);
    //                         const orders = data.rows;
    //                         for (order of orders) {
    //                         }
    //                     },
    //                     err => {
    //                         reject(err);
    //                     }
    //                 )
    //                 .finally(() => client.release());
    //         })
    //         .catch(err => reject(err));
    // });
};

sub.subscribe("prices", function(err, count) {});

sub.on("message", (channel, message) => {
    console.log(
        `Received a message from channel ${channel} with message = ${message}`
    );
    redis
        .get("prices")
        .then(prices => {
            // processOrdersWhenPricesUpdated(prices);
            // prices = result;
            // Query the orders table to check the data to process
            // console.log(result);
        })
        .catch(err => console.log(err));
});

const getRowDataWithProductAndExchange = (prices, product, exchange) => {
    const data = prices[product];
    const trimmed = exchange.replace(/\s/g, "");
    const exchangeName = trimmed.substring(0, 3).toLowerCase();
    const term = trimmed.substring(3);
    return data[exchangeName].filter(row => row[0] === term)[0];
};

const calculateFinalValue = (placing_price, closing_price, volume) =>
    (closing_price - placing_price) * (volume * 100000);

module.exports = {
    orderField: orderFields,
    createOrder,
    closeOrder,
    // updateOrder,
    getOrderById,
    getActiveOrdersByAccountId,
    getOrderHistoryByAccountId
};
