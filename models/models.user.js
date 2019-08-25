const pool = require("../db/pool");
const userQueries = require("../db/queries/queries.user");
const validator = require("../utils/input_validator");
const bcrypt = require("bcrypt");

const saltRounds = 10;

class User {
    static register(info) {
        const validationRes = validator.validateAuth(info);
        if (!validationRes.isValid) {
            return Promise.reject({
                status: 406,
                message: validationRes.message
            });
        }
        return new Promise((resolve, reject) =>
            this.checkExistence(info.phone)
                .then(exists => {
                    if (exists) {
                        reject({
                            status: 409,
                            message: "Phone number existed!"
                        });
                    } else {
                        resolve(
                            pool.connect().then(client => {
                                return bcryptHash(info.password).then(hash => {
                                    info.password = hash;
                                    return client.query(
                                        userQueries.registerQuery(info)
                                    );
                                });
                            })
                        );
                    }
                })
                .catch(err => {
                    reject({
                        status: 500,
                        message: ""
                    });
                })
        );
    }

    static login(info) {
        const validationRes = validator.validateAuth(info);
        if (!validationRes.isValid) {
            return Promise.reject({
                status: 406,
                message: validationRes.message
            });
        }
        return new Promise((resolve, reject) =>
            this.checkExistence(info.phone)
                .then(exists => {
                    if (!exists) {
                        reject({
                            status: 409,
                            message: "Phone has not been registered!"
                        });
                    } else {
                        return this.getUserByPhoneNumber(info.phone).then(
                            data => {
                                const user = data.rows[0];
                                return bcryptCompare(
                                    info.password,
                                    user.password
                                ).then(
                                    isMatch => {
                                        if (isMatch) resolve(user);
                                        else
                                            reject({
                                                status: 401,
                                                message: "Unauthorized!"
                                            });
                                    },
                                    err => {
                                        reject({
                                            status: 500,
                                            message: ""
                                        });
                                    }
                                );
                            }
                        );
                    }
                })
                .catch(err => {
                    console.log(this, err);
                    reject({
                        status: 500,
                        message: ""
                    });
                })
        );
    }

    static getUserByPhoneNumber(phone) {
        return pool.connect().then(client => {
            return client.query(userQueries.getUserByPhone(phone));
        });
    }

    static getUserById(user_uid) {
        return pool.connect().then(client => {
            return client.query(userQueries.getUserById(user_uid));
        });
    }

    static checkExistence(phone) {
        return pool.connect().then(
            client =>
                client.query(userQueries.checkExistence(phone)).then(data => {
                    const exists = data.rows[0].exists;
                    console.log(`heeh exists = ${exists}`);
                    return Promise.resolve(exists);
                }),
            err => {
                console.log("checkExistence", err);
                return Promise.reject({
                    status: 500,
                    message: ""
                });
            }
        );
    }
}

const bcryptHash = password =>
    bcrypt.genSalt(saltRounds).then(salt => {
        return bcrypt.hash(password, salt);
    });

const bcryptCompare = (password, hash) => bcrypt.compare(password, hash);

module.exports = User;
