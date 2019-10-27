const Redis = require("ioredis");
const redis = new Redis();
const sub = new Redis();
const Error = require("../utils/custom_error");

const getAllPrices = () => {
    return redis
        .get("prices")
        .then(result => Promise.resolve(result))
        .catch(err => Promise.reject(Error(error)));
};

module.exports = { getAllPrices };
