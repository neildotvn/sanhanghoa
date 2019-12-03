const { pool } = require("../db/pool");
const queries = require("../db/queries/queries.alarm");
const _ = require("lodash");

const getAlarmsByUserId = req => {
    const user_uid = req.auth["user_uid"];

    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.getAlarmsByUserId(user_uid))
                .then(results => {
                    resolve(results.rows);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const createAlarm = req => {
    const alarmInfo = Object.values(_.pick(req.body, ["product", "exchange", "alarm_type", "price", "description"]));
    alarmInfo.push(req.auth.user_uid);

    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.createAlarm(alarmInfo))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const enableAlarm = req => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.enableAlarm(req.params["alarm_uid"]))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const disableAlarm = req => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.disableAlarm(req.params["alarm_uid"]))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const deleteAlarm = req => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.deleteAlarm(req.params["alarm_uid"]))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

module.exports = {
    getAlarmsByUserId,
    createAlarm,
    enableAlarm,
    disableAlarm,
    deleteAlarm
};
