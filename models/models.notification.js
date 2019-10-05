const pool = require("../db/pool");
const notiQueries = require("../db/queries/queries.notification");
const Error = require("../utils/custom_error");

const getAllNotifications = () => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(notiQueries.getAllNotifications())
                .then(
                    data => {
                        console.log(this, "success");
                        resolve(data.rows);
                        client.release();
                    },
                    err => {
                        console.log(this, err);
                        reject(new Error(406, err));
                        client.release();
                    }
                )
                .catch(err => reject(err));
        });
    });
};

const getNotiById = noti_uid => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                client.query(notiQueries.getNotificationById(noti_uid)).then(
                    data => {
                        console.log(this, "Success");
                        resolve(data.rows[0]);
                        client.release();
                    },
                    err => {
                        client.release();
                        reject(new Error(406, "Wrong input"));
                        console.log(this, err);
                    }
                );
            })
            .catch(err => {
                reject(err);
            });
    });
};

module.exports = { getAllNotifications, getNotiById };
