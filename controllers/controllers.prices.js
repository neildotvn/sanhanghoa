const model = require("../models/models.prices");

const getAllPrices = (req, res, next) => {
    model
        .getAllPrices()
        .then(result => res.status(200).send(result))
        .catch(err => next(err));
};

module.exports = { getAllPrices };
