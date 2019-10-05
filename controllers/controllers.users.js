const userModel = require("../models/models.users");

class UsersController {
    static getUserInfo(req, res, next) {
        console.log(req.auth);
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
}

module.exports = UsersController;
