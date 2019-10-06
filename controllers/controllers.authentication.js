const UserModel = require("../models/models.users");
const AuthMiddleware = require("../middlewares/middlewares.authentication");

// const verify = (req, res, next) => {
//     UserModel.getUserById(req.auth.user_id)
//         .then(user => res.status(200).user)
//         .catch(err => next(err));
// };

const register = (req, res, next) => {
    const regInfo = {
        phone: req.body.phone,
        password: req.body.password
    };
    UserModel.register(regInfo)
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
    UserModel.login(req.body)
        .then(user => {
            const token = AuthMiddleware.generateToken(user);
            user.token = token;
            res.status(200).send(user);
        })
        .catch(err => {
            next(err);
        });
};

module.exports = { register, login };
