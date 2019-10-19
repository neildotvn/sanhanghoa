const prices = require("../models/models.prices");

const getAllPrices = (req, res, next) => {
    res.status(200).send(prices);
};

module.exports = { getAllPrices };
