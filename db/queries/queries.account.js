module.exports = {
    createAccount: () => {
        return {
            text:
                "INSERT INTO account(account_uid) values (uuid_generate_v4()) RETURNING *"
        };
    },
    getAccountInfo: user_uid => {
        return {
            text: "SELECT * FROM account WHERE user_uid=$1",
            values: [user_uid]
        };
    }
};
