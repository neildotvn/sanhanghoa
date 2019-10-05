const userModel = require("../models/models.users");
const AuthMiddleware = require("../middlewares/middlewares.authentication");

const verify = (req, res) => {
    const result = AuthMiddleware.verify(req);
    if (!result.payload) {
        res.status(result.status).send("Token invalid!");
    } else {
        res.status(result.status).send(result.payload);
    }
};

const register = (req, res, next) => {
    const regInfo = {
        phone: req.body.phone,
        password: req.body.password
    };
    userModel
        .register(regInfo)
        .then(data => {
            console.log(data);
            const user = data.rows[0];
            const token = AuthMiddleware.generateToken(user);
            user.token = token;
            res.status(200).send(user);
        })
        .catch(err => {
            next(err);
        });
};

const login = (req, res, next) => {
    userModel
        .login(req.body)
        .then(user => {
            const token = AuthMiddleware.generateToken(user);
            user.token = token;
            res.status(200).send(user);
        })
        .catch(err => {
            next(err);
        });
};

module.exports = { verify, register, login };
