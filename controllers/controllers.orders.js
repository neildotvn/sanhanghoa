const ordersModel = require("../models/models.orders");

class UsersController {
    static createOrder(req, res) {
        ordersModel
            .createOrder(req)
            .then(data => {
                console.log(this, data);
                res.status(data.status).send(data.payload);
            })
            .catch(err => {
                if (err.status) {
                    res.status(err.status).send(err.message);
                } else {
                    console.log(err);
                    res.status(500).end();
                }
            });
    }
}

module.exports = UsersController;
