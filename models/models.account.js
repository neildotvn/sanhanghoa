const pool = require("../db/pool");
const accountQueries = require("../db/queries/queries.account");

module.exports = class Account {
    static createAccount() {
        return new Promise((resolve, reject) => {
            pool.connect().then(client => {
                client.query(accountQueries.createAccount()).then(data => {
                    const account = data.rows[0];
                    resolve(account);
                });
            });
        });
    }
};
