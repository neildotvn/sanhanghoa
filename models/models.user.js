const pool = require("../db/pool");
const userQueries = require("../db/queries/queries.user");

class User {
    static register(reqInfo) {
        return pool.connect().then(client => {
            return client.query(userQueries.registerQuery(reqInfo));
        });
    }
}

module.exports = User;
