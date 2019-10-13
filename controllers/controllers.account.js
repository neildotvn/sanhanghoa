const { getAccountInfoByAccountId } = require("../models/models.account");

const getAccountInfo = (req, res, next) => {
    getAccountInfoByAccountId(req.auth.account_uid)
        .then(data => {
            console.log(this, data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(this, err);
            next(err);
        });
};

module.exports = { getAccountInfo };
