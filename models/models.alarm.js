const { pool } = require("../db/pool");
const queries = require("../db/queries/queries.alarm");
const userModel = require("./models.users");
const _ = require("lodash");
const Redis = require("ioredis");
const redis = new Redis();
const sub = new Redis();
const { pushNotification } = require("../utils/notifications");

const getAlarmsByUserId = req => {
    const user_uid = req.auth["user_uid"];

    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.getAlarmsByUserId(user_uid))
                .then(results => {
                    resolve(results.rows);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const createAlarm = req => {
    const alarmInfo = Object.values(_.pick(req.body, ["product", "exchange", "alarm_type", "price", "description"]));
    alarmInfo.push(req.auth.user_uid);

    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.createAlarm(alarmInfo))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const enableAlarm = req => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.enableAlarm(req.params["alarm_uid"]))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const disableAlarm = req => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.disableAlarm(req.params["alarm_uid"]))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const deleteAlarm = req => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.deleteAlarm(req.params["alarm_uid"]))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

const deleteAlarmByAlarmId = alarm_uid => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client
                .query(queries.deleteAlarm(alarm_uid))
                .then(results => {
                    resolve(results.rows[0]);
                })
                .catch(err => reject(err))
                .finally(() => client.release());
        });
    });
};

sub.subscribe("prices", function(err, count) {});

sub.on("message", (channel, message) => {
    console.log(`Alarm model received a message from channel ${channel} with message = ${message}`);
    redis
        .get("prices")
        .then(prices => {
            processAlarmsWhenPricesUpdated(prices);
        })
        .catch(err => console.log(err));
});

const processAlarmsWhenPricesUpdated = prices => {
    pool.connect()
        .then(client => {
            client
                .query("SELECT * FROM alarm")
                .then(
                    data => {
                        const alarms = data.rows;
                        for (alarm of alarms) {
                            try {
                                productPrices = JSON.parse(prices)[alarm.product];
                                let filteredProduct;
                                if (alarm.exchange.includes("ICE")) {
                                    filteredProduct = productPrices.ice.filter(
                                        row => row[0] === alarm.exchange.substring(4)
                                    )[0];
                                } else if (alarm.exchange.includes("NYB")) {
                                    filteredProduct = productPrices.nyb.filter(
                                        row => row[0] === alarm.exchange.substring(4)
                                    )[0];
                                }
                                const currentPrice = filteredProduct[1];

                                if (alarm.alarm_type === 0) {
                                    if (currentPrice >= alarm.price) {
                                        if (alarm.status === 0) {
                                            userModel
                                                .getUserById(alarm.user_uid)
                                                .then(user => {
                                                    pushNotification(
                                                        user.push_token,
                                                        "Thông báo giá",
                                                        `Giá ${
                                                            productMap[alarm.product].name
                                                        } đã đạt mức ${currentPrice}`
                                                    );
                                                })
                                                .catch(err => console.log(err));
                                        }
                                        deleteAlarmByAlarmId(alarm.alarm_uid)
                                            .then(() => console.log("Alarm done!"))
                                            .catch(err => console.log(err));
                                        // console.log("Dmm bao nhanh len");
                                    } else {
                                        // console.log("chua dc dau em oi");
                                    }
                                } else {
                                    if (currentPrice <= alarm.price) {
                                        if (alarm.status === 0) {
                                            userModel
                                                .getUserById(alarm.user_uid)
                                                .then(user => {
                                                    pushNotification(
                                                        user.push_token,
                                                        "Thông báo giá",
                                                        `Giá ${
                                                            productMap[alarm.product].name
                                                        } đã đạt mức ${currentPrice}`
                                                    );
                                                })
                                                .catch(err => console.log(err));
                                        }
                                        deleteAlarmByAlarmId(alarm.alarm_uid)
                                            .then(() => console.log("Alarm done!"))
                                            .catch(err => console.log(err));
                                        // console.log("Dmm bao nhanh len");
                                    } else {
                                        // console.log("chua dc dau em oi");
                                    }
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    },
                    err => {
                        console.log(err);
                    }
                )
                .finally(() => client.release());
        })
        .catch(err => console.log(e));
};

const productMap = {
    robusta: {
        name: "Cà phê Robusta",
        key: "robusta",
        leverage: 10
    },
    arabica: {
        name: "Cà phê Arabica",
        key: "arabica",
        leverage: 375
    },
    cotton: {
        name: "Bông",
        key: "cotton",
        leverage: 500
    },
    rubber: {
        name: "Cao su",
        key: "rubber",
        leverage: 50
    },
    cocoa: {
        name: "Ca cao",
        key: "cocoa",
        leverage: 10
    }
};

module.exports = {
    getAlarmsByUserId,
    createAlarm,
    enableAlarm,
    disableAlarm,
    deleteAlarm
};
