const userModel = require("../models/models.users");

class UsersController {
    static getUserInfo(req, res) {
        console.log(req.auth);
        userModel
            .getUserById(req.auth.user_uid)
            .then(data => {
                console.log(this, data);
                res.status(data.status).send(data.payload);
            })
            .catch(err => {
                if (err.status) {
                    res.status(err.status).send(err.message);
                } else {
                    console.log(err);
                }
            });
    }
}

module.exports = UsersController;
