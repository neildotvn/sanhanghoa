const _ = require("lodash");

module.exports = {
    createOrder: values => {
        return {
            text:
                "INSERT INTO orders (order_uid, exchange, order_type, volume, placing_price, take_profit_price, stop_loss_price, account_uid) values (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7) RETURNING *",
            values
        };
    }
};
