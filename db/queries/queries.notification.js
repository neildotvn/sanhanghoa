module.exports = {
    getAllNotifications: () => {
        return {
            text: "SELECT * FROM notification"
        };
    },
    getNotificationById: noti_uid => {
        return {
            text: "SELECT 1 FROM notification WHERE noti_uid=$1"
        };
    }
};
