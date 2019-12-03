module.exports = {
    getAlarmsByUserId: user_uid => {
        return {
            text: "SELECT * FROM alarm WHERE user_uid=$1",
            values: [user_uid]
        };
    },
    createAlarm: values => {
        return {
            text:
                "INSERT INTO alarm(alarm_uid, created_at, product, exchange, alarm_type, price, description, user_uid) values (uuid_generate_v4(), NOW(), $1, $2, $3, $4, $5, $6) RETURNING *",
            values
        };
    },
    enableAlarm: alarm_uid => {
        return {
            text: "UPDATE alarm SET status=0 WHERE alarm_uid=$1",
            values: [alarm_uid]
        };
    },
    disableAlarm: alarm_uid => {
        return {
            text: "UPDATE alarm SET status=1 WHERE alarm_uid=$1",
            values: [alarm_uid]
        };
    },
    deleteAlarm: alarm_uid => {
        return {
            text: "DELETE FROM alarm WHERE alarm_uid=$1",
            values: [alarm_uid]
        };
    }
};
