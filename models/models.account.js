const pool = require("../db/pool");
const accountQueries = require("../db/queries/queries.account");

const createAccount = () => {
    return new Promise((resolve, reject) => {
        pool.connect().then(
            client => {
                client.query(accountQueries.createAccount()).then(data => {
                    const account = data.rows[0];
                    resolve(account);
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

module.exports = { createAccount };
