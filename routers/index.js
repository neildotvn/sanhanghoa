const AuthModel = require("../models/models.authentication");

module.exports = app => {
    app.use("/api/v1", require("./unauth"));
    app.use("/api/v1/user", [AuthModel.authenticate], require("./user"));
};
