const AuthModel = require("../models/models.authentication");

module.exports = app => {
    app.use("/api/v1", require("./routers.unauth"));
    app.use(
        "/api/v1/users",
        [AuthModel.authenticate],
        require("./routers.users")
    );
    app.use("/api/v1/accounts", require("./routes.account"));
    app.use(
        "/api/v1/orders",
        [AuthModel.authenticate],
        require("./routes.orders")
    );
};
