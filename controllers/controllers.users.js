const userModel = require("../models/models.users");

class UsersController {
    static getUserInfo(req, res, next) {
        userModel
            .getUserById(req.auth.user_uid)
            .then(data => {
                console.log(this, data);
                res.status(200).send(data);
            })
            .catch(err => {
                next(err);
            });
    }

    static updateUserInfo(req, res, next) {
        const user = { ...req.body, user_uid: req.auth.user_uid };
        userModel.updateUserInfo(user).then(
            data => {
                console.log(this, data);
                res.status(200).send(data);
            },
            err => next(err)
        );
    }
}

module.exports = UsersController;
