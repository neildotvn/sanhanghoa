const userModel = require("../models/models.users");
const authModel = require("../models/models.authentication");

class AuthenticationController {
    static verify(req, res) {
        const result = authModel.verify(req);
        if (!result.payload) {
            res.status(result.status).send("Token invalid!");
        } else {
            res.status(result.status).send(result.payload);
        }
    }

    static register(req, res) {
        const regInfo = {
            phone: req.body.phone,
            password: req.body.password
        };
        userModel
            .register(regInfo)
            .then(data => {
                console.log(data);
                const user = data.rows[0];
                const token = authModel.generateToken(user);
                user.token = token;
                res.status(200).send(user);
            })
            .catch(err => {
                if (err.status) {
                    res.status(err.status).send(err.message);
                } else {
                    console.log(err);
                }
            });
    }

    static login(req, res) {
        userModel
            .login(req.body)
            .then(user => {
                const token = authModel.generateToken(user);
                user.token = token;
                res.status(200).send(user);
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

module.exports = AuthenticationController;
