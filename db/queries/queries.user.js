const { usersVars } = require("../db.variables");

module.exports = {
    registerQuery: reqInfo => {
        return {
            text:
                "INSERT INTO users(user_uid, phone, password) values (uuid_generate_v4(), $1, $2) RETURNING *",
            values: [reqInfo.phone, reqInfo.password]
        };
    }
};
