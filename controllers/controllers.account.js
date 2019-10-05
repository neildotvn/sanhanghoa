const { getAccountInfoByUserId } = require("../models/models.account");

class AccountController {
    static getAccountInfoByUserId(req, res, next) {
        // res.status(200).send(req.params);
        getAccountInfoByUserId(req.params.user_uid)
            .then(data => {
                console.log(this, data);
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(this, err);
                next(err);
            });
    }
}

module.exports = AccountController;
