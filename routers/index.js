const AuthModel = require("../models/models.authentication");

module.exports = app => {
    app.use("/api/v1", require("./routers.unauth"));
    app.use(
        "/api/v1/users",
        [AuthModel.authenticate],
        require("./routers.users")
    );
};
