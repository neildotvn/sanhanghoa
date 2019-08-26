const pool = require("../db/pool");
const ordersQueries = require("../db/queries/queries.orders");
const { omitEmpty } = require("../utils/object_utils");

module.exports = class Orders {
    static get orderField() {
        return [
            "exchange",
            "order_type",
            "volume",
            "placing_price",
            "take_profit_price",
            "stop_loss_price",
            "account_uid"
        ];
    }

    static createOrder(req) {
        const orderInfo = this.orderField.map(value => {
            if (value === "account_uid") return req.body.auth.account_uid;
            return req.body[value];
        });

        return new Promise((resolve, reject) => {
            pool.connect().then(client => {
                client.query(ordersQueries.createOrder(orderInfo)).then(
                    data => {
                        const order = data.rows[0];
                        resolve({
                            status: 200,
                            payload: omitEmpty(order)
                        });
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        });
    }

    static updateOrder(req) {
        const body = req.body;
    }
};
