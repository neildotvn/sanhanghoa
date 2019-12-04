const userModel = require("../models/models.users");

const getUserInfo = (req, res, next) => {
    userModel
        .getUserById(req.auth.user_uid)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            next(err);
        });
};

const updateUserInfo = (req, res, next) => {
    const user = { ...req.body, user_uid: req.auth.user_uid };
    userModel.updateUserInfo(user).then(
        data => {
            console.log(this, data);
            res.status(200).send(data);
        },
        err => next(err)
    );
};

const setPushToken = (req, res, next) => {
    userModel
        .setPushToken(req)
        .then(() => res.status(200).send("Push token setting succeeded!"))
        .catch(err => next(err));
};

module.exports = {
    getUserInfo,
    updateUserInfo,
    setPushToken
};
