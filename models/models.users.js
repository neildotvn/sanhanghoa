const pool = require("../db/pool");
const userQueries = require("../db/queries/queries.users");
const accountModel = require("../models/models.account");
const validator = require("../utils/input_validator");
const bcrypt = require("bcrypt");
const { omitEmpty } = require("../utils/object_utils");
const Error = require("../utils/custom_error");

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
                        reject(new Error(409, "Phone number existed!"));
                    } else {
                        accountModel.createAccount().then(account => {
                            resolve(
                                pool.connect().then(client => {
                                    return bcryptHash(info.password).then(
                                        hash => {
                                            info.password = hash;
                                            info.account_uid =
                                                account.account_uid;
                                            return client.query(
                                                userQueries.registerQuery(info)
                                            );
                                        }
                                    );
                                })
                            );
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        );
    }

    static login(info) {
        return new Promise((resolve, reject) => {
            const validationRes = validator.validateAuth(info);
            console.log(validationRes);
            if (!validationRes.isValid) {
                reject(new Error(406, validationRes.message));
            }
            this.checkExistence(info.phone)
                .then(exists => {
                    if (!exists) {
                        const err = new Error("Phone number existed!");
                        err.status = 409;
                        reject(err);
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
                                        if (isMatch) resolve(omitEmpty(user));
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
                    reject(err);
                });
        });
    }

    static getUserByPhoneNumber(phone) {
        return pool.connect().then(client => {
            return client.query(userQueries.getUserByPhone(phone));
        });
    }

    static getUserById(user_uid) {
        return new Promise((resolve, reject) =>
            pool.connect().then(client => {
                client
                    .query(userQueries.getUserById(user_uid))
                    .then(data => {
                        const user = data.rows[0];
                        resolve({
                            status: 200,
                            payload: user
                        });
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
        );
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
                return Promise.reject(err);
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
