const { pool } = require("../db/pool");
const userQueries = require("../db/queries/queries.users");
const accountModel = require("../models/models.account");
const validator = require("../utils/input_validator");
const bcrypt = require("bcrypt");
const { omitEmpty } = require("../utils/object_utils");
const _ = require("lodash");
const Error = require("../utils/custom_error");

const saltRounds = 10;

const checkExistence = phone => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client =>
                client.query(userQueries.checkExistence(phone)).then(
                    data => {
                        const isExisted = data.rows[0].exists;
                        console.log(data);
                        resolve(isExisted);
                        client.release();
                    },
                    err => {
                        console.log(err);
                        reject(true);
                        client.release();
                    }
                )
            )
            .catch(err => {
                console.log("checkExistence", err);
                reject(err);
            });
    });
};

const register = info => {
    return new Promise((resolve, reject) => {
        const validationRes = validator.validateAuth(info);
        if (!validationRes.isValid) {
            reject(new Error(406, validationRes.message));
        } else {
            checkExistence(info.phone)
                .then(isExisted => {
                    if (isExisted) {
                        reject(new Error(409, "Phone number existed"));
                    } else {
                        accountModel.createAccount().then(account => {
                            pool.connect().then(client => {
                                bcryptHash(info.password).then(hash => {
                                    info.password = hash;
                                    info.account_uid = account.account_uid;
                                    client
                                        .query(userQueries.registerQuery(info))
                                        .then(
                                            data => {
                                                client.release();
                                                resolve(data);
                                            },
                                            err => {
                                                client.release();
                                                reject(err);
                                                console.log(
                                                    "register error!",
                                                    err
                                                );
                                            }
                                        );
                                });
                            });
                        });
                    }
                })
                .catch(err => {
                    console.log("register error!", err);
                    reject(err);
                });
        }
    });
};

const login = info => {
    return new Promise((resolve, reject) => {
        const validationRes = validator.validateAuth(info);
        console.log("info", info);
        if (!validationRes.isValid) {
            reject(new Error(406, validationRes.message));
        } else {
            checkExistence(info.phone)
                .then(exists => {
                    if (!exists) {
                        reject(new Error(409, "Account has not been created!"));
                    } else {
                        console.log("exists = " + exists);
                        getUserByPhoneNumber(info.phone).then(user => {
                            bcryptCompare(info.password, user.password).then(
                                isMatch => {
                                    if (isMatch)
                                        resolve(_.omit(user, "password"));
                                    else
                                        reject(new Error(401, "Unauthorized!"));
                                }
                            );
                        });
                    }
                })
                .catch(err => {
                    console.log("Login fails", err);
                    reject(err);
                });
        }
    });
};

const getUserByPhoneNumber = phone => {
    return new Promise((resolve, reject) => {
        pool.connect().then(client => {
            client.query(userQueries.getUserByPhone(phone)).then(
                data => {
                    client.release();
                    console.log(data);
                    resolve(data.rows[0]);
                },
                err => {
                    client.release();
                    reject(err);
                }
            );
        });
    });
};

const getUserById = user_uid => {
    return new Promise((resolve, reject) =>
        pool
            .connect()
            .then(client => {
                client
                    .query(userQueries.getUserById(user_uid))
                    .then(data => {
                        console.log(data.rows.length);
                        client.release();
                        if (data.rows.length === 0) {
                            reject(new Error(400, "This user doesn't exist!"));
                        } else {
                            const user = data.rows[0];
                            resolve(_.omit(user, "password"));
                        }
                    })
                    .catch(err => {
                        client.release();
                        reject(err);
                    });
            })
            .catch(err => reject(err))
    );
};

const updateUserInfo = user => {
    return new Promise((resolve, reject) => {
        pool.connect().then(
            client => {
                client
                    .query(userQueries.getUserById(user.user_uid))
                    .then(data => {
                        const currentUser = data.rows[0];
                        const values = [
                            "full_name",
                            "address",
                            "date_of_birth",
                            "email",
                            "gender",
                            "user_uid"
                        ];
                        const updatingUser = _.pick(user, values);
                        for (const key in updatingUser) {
                            const value = updatingUser[key];
                            if (value) currentUser[key] = value;
                        }
                        const updatedUserValues = _.values(
                            _.pick(currentUser, values)
                        );
                        // return resolve(updatedUserValues);
                        client
                            .query(
                                userQueries.updateUserInfo(updatedUserValues)
                            )
                            .then(
                                data => {
                                    console.log(data);
                                    resolve(_.omit(currentUser, ["password"]));
                                },
                                err => reject(err)
                            );
                    })
                    .catch(err => {
                        reject(err);
                    })
                    .finally(() => client.release());
            },
            err => reject(err)
        );
    });
};

const bcryptHash = password =>
    bcrypt.genSalt(saltRounds).then(salt => {
        return bcrypt.hash(password, salt);
    });

const bcryptCompare = (password, hash) => bcrypt.compare(password, hash);

module.exports = { register, login, getUserById, updateUserInfo };
