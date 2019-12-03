const model = require("../models/models.alarm");

const getAlarmsByUserId = (req, res, next) => {
    model
        .getAlarmsByUserId(req)
        .then(alarms => {
            res.status(200).send(alarms);
        })
        .catch(err => next(err));
};

const createAlarm = (req, res, next) => {
    model
        .createAlarm(req)
        .then(alarm => {
            res.status(200).send(alarm);
        })
        .catch(err => next(err));
};

const enableAlarm = (req, res, next) => {
    model
        .enableAlarm(req)
        .then(() => res.status(200).send("enabled alarm successfully"))
        .catch(err => next(err));
};

const disableAlarm = (req, res, next) => {
    model
        .disableAlarm(req)
        .then(() => res.status(200).send("disabled alarm successfully"))
        .catch(err => next(err));
};

const deleteAlarm = (req, res, next) => {
    model
        .deleteAlarm(req)
        .then(() => res.status(200).send("alarm deleted"))
        .catch(err => next(err));
};

module.exports = {
    getAlarmsByUserId,
    createAlarm,
    enableAlarm,
    disableAlarm,
    deleteAlarm
};
