const { pool } = require("../db/pool");
const Redis = require("ioredis");
const redis = new Redis();
const sub = new Redis();
const ordersQueries = require("../db/queries/queries.orders");
const accountModel = require("../models/models.account");
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

const leverageValues = {
    // platinum: 50,
    // natural_gas: 10000,
    rubber: 50,
    // silver: 5000,
    cocoa: 10,
    // mini_corn: 10,
    // copper: 25000,
    cotton: 500,
    // sugar: 1120,
    // wheat: 50,
    // soybeans: 50,
    // corn: 50,
    robusta: 10,
    arabica: 375
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
                    .query(ordersQueries.getActiveOrdersByAccountId(req.auth.account_uid))
                    .then(
                        data => {
                            const orders = data.rows;
                            resolve(orders.map(order => _.omitBy(order, _.isNull)));
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
                    .query(ordersQueries.getOrderHistoryByAccountId(req.auth.account_uid))
                    .then(
                        data => {
                            const orders = data.rows;
                            resolve(orders.map(order => _.omitBy(order, _.isNull)));
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
                                    client.query(ordersQueries.closeOrderById(order_uid, closingPrice)).then(
                                        data => {
                                            resolve("success");
                                            let value = 0;
                                            if (
                                                order.order_type === 0 ||
                                                order.order_type === 2 ||
                                                order.order_type === 4
                                            ) {
                                                value = order.volume * (closingPrice - order.placing_price);
                                            } else {
                                                value = order.volume * (order.placing_price - closingPrice);
                                            }
                                            accountModel.updateAccountByChange(order.account_uid, value);
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

const activateOrder = order_uid => {
    pool.connect()
        .then(client => {
            client
                .query(ordersQueries.activateOrder(order_uid))
                .then(
                    result => {
                        console.log("Order activated!");
                    },
                    err => {
                        console.log("Order activation failed!", err);
                        reject(err);
                    }
                )
                .finally(() => client.release());
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
};

const processOrdersWhenPricesUpdated = prices => {
    pool.connect()
        .then(client => {
            client
                .query("SELECT * FROM orders WHERE order_status=0")
                .then(
                    data => {
                        const orders = data.rows;
                        for (order of orders) {
                            try {
                                const rows = prices[order.product];
                                const filteredProduct = rows.filter(row => row[0] === order.exchange)[0];
                                if (filteredProduct) {
                                    const tradingPrice = filteredProduct[1];
                                    switch (order.order_type) {
                                        case 0: // buy
                                            if (
                                                order.take_profit_price != null &&
                                                tradingPrice > order.take_profit_price
                                            ) {
                                                closeOrder(order.order_uid);
                                            } else if (
                                                order.stop_loss_price != null &&
                                                tradingPrice < order.stop_loss_price
                                            ) {
                                                closeOrder(order.order_uid);
                                            }
                                            break;
                                        case 1: // sell
                                            if (
                                                order.take_profit_price != null &&
                                                tradingPrice < order.take_profit_price
                                            ) {
                                                closeOrder(order.order_uid);
                                            } else if (
                                                order.stop_loss_price != null &&
                                                tradingPrice > order.stop_loss_price
                                            ) {
                                                closeOrder(order.order_uid);
                                            }
                                            break;
                                        case 2: // buy limit
                                            if (order.order_status === 1) {
                                                if (tradingPrice < order.placing_price) {
                                                    activateOrder(order.order_uid);
                                                }
                                            } else {
                                                if (
                                                    order.take_profit_price != null &&
                                                    tradingPrice > order.take_profit_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                } else if (
                                                    order.stop_loss_price != null &&
                                                    tradingPrice < order.stop_loss_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                }
                                            }
                                            break;
                                        case 3: // sell limit
                                            if (order.order_status === 1) {
                                                if (tradingPrice > order.placing_price) {
                                                    activateOrder(order.order_uid);
                                                }
                                            } else {
                                                if (
                                                    order.take_profit_price != null &&
                                                    tradingPrice < order.take_profit_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                } else if (
                                                    order.stop_loss_price != null &&
                                                    tradingPrice > order.stop_loss_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                }
                                            }
                                            break;
                                        case 4: // buy stop
                                            if (order.order_status === 1) {
                                                if (tradingPrice > order.placing_price) {
                                                    activateOrder(order.order_uid);
                                                }
                                            } else {
                                                if (
                                                    order.take_profit_price != null &&
                                                    tradingPrice > order.take_profit_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                } else if (
                                                    order.stop_loss_price != null &&
                                                    tradingPrice < order.stop_loss_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                }
                                                break;
                                            }
                                            break;
                                        case 5: // sell stop
                                            if (order.order_status === 1) {
                                                if (tradingPrice < order.placing_price) {
                                                    activateOrder(order.order_uid);
                                                }
                                            } else {
                                                if (
                                                    order.take_profit_price != null &&
                                                    tradingPrice < order.take_profit_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                } else if (
                                                    order.stop_loss_price != null &&
                                                    tradingPrice > order.stop_loss_price
                                                ) {
                                                    closeOrder(order.order_uid);
                                                }
                                            }
                                            break;
                                    }
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    },
                    err => {
                        console.log(e);
                    }
                )
                .finally(() => client.release());
        })
        .catch(err => console.log(e));
};

sub.subscribe("prices", function(err, count) {});

sub.on("message", (channel, message) => {
    console.log(`Received a message from channel ${channel} with message = ${message}`);
    redis
        .get("prices")
        .then(prices => {
            processOrdersWhenPricesUpdated(prices);
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
