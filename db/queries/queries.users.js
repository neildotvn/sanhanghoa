module.exports = {
    checkExistence: phone => {
        return {
            text: "SELECT EXISTS (SELECT 1 FROM users WHERE phone=$1)",
            values: [phone]
        };
    },
    registerQuery: regInfo => {
        return {
            text:
                "INSERT INTO users(user_uid, phone, password, account_uid) values (uuid_generate_v4(), $1, $2, $3) RETURNING *",
            values: [regInfo.phone, regInfo.password, regInfo.account_uid]
        };
    },
    getUserById: user_uid => {
        return {
            text: "SELECT * FROM users WHERE user_uid=$1",
            values: [user_uid]
        };
    },
    getUserByPhone: phone => {
        return {
            text: "SELECT * FROM users WHERE phone=$1",
            values: [phone]
        };
    }
};
