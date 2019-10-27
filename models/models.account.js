const { pool } = require("../db/pool");
const accountQueries = require("../db/queries/queries.account");
const userQueries = require("../db/queries/queries.users");
const Error = require("../utils/custom_error");

const createAccount = () => {
    return new Promise((resolve, reject) => {
        pool.connect().then(
            client => {
                client.query(accountQueries.createAccount()).then(data => {
                    const account = data.rows[0];
                    resolve(account);
                    client.release();
                });
            },
            err => {
                client.release();
                reject(err);
                console.error("Unable to create account", err);
            }
        );
    });
};

const getAccountInfoByAccountId = account_uid => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(accountQueries.getAccountInfoByAccountId(account_uid))
                .then(
                    data => {
                        const account = data.rows[0];
                        resolve(account);
                    },
                    err => {
                        reject(err);
                    }
                )
                .finally(() => client.release());
        });
    });
};

const getAccountInfoByUserId = user_uid => {
    return new Promise((resolve, reject) => {
        pool.connect().then(
            client => {
                client
                    .query(userQueries.getUserById(user_uid))
                    .then(data => {
                        const user = data.rows[0];
                        client
                            .query(
                                accountQueries.getAccountInfo(user.account_uid)
                            )
                            .then(data => {
                                client.release();
                                const account = data.rows[0];
                                resolve(account);
                            });
                    })
                    .catch(err => {
                        client.release();
                        reject(new Error(406, "Wrong input"));
                        console.log(this, err);
                    });
            },
            err => {
                console.log(this, err);
                reject(err);
            }
        );
    });
};

module.exports = { createAccount, getAccountInfoByAccountId };
