const userModel = require("../models/models.users");
const authModel = require("../models/models.authentication");
const pool = require("../db/pool");
const userQueries = require("../db/queries/queries.users");

const verify = (req, res) => {
    const result = authModel.verify(req);
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
            const token = authModel.generateToken(user);
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
            const token = authModel.generateToken(user);
            user.token = token;
            res.status(200).send(user);
        })
        .catch(err => {
            next(err);
        });
};

module.exports = { verify, register, login };
