const AuthMiddleware = require("../middlewares/middlewares.authentication");

module.exports = app => {
    app.use("/api/v1", require("./routers.unauth"));
    app.use(
        "/api/v1/users",
        [AuthMiddleware.authenticate],
        require("./routers.users")
    );
    app.use(
        "/api/v1/accounts",
        [AuthMiddleware.authenticate],
        require("./routes.account")
    );
    app.use(
        "/api/v1/orders",
        [AuthMiddleware.authenticate],
        require("./routes.orders")
    );
    app.use(
        "/api/v1/notifications",
        [AuthMiddleware.authenticate],
        require("./routers.notification")
    );
};
