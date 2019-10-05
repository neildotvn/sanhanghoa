const model = require("../models/models.notification");

const getAllNotifications = (req, res, next) => {
    model
        .getAllNotifications()
        .then(notis => {
            res.status(200).send(notis);
        })
        .catch(err => next(err));
};

const getNotiById = (req, res, next) => {
    model
        .getNotiById(req.noti_uid)
        .then(noti => {
            res.status(200).send(noti);
        })
        .catch(err => next(err));
};

module.exports = { getAllNotifications };
