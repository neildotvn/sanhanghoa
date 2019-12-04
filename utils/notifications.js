const axios = require("axios").default;

const instance = axios.create({
    baseURL: "https://exp.host/--/api/v2/push/send",
    timeout: 10000,
    headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json"
    }
});

const pushNotification = (token, title, body) => {
    instance
        .post("", {
            to: token,
            sound: "default",
            title,
            body
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));
};

module.exports = { pushNotification };
