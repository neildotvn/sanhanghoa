const express = require("express");
const controller = require("../controllers/controllers.orders");

const router = express.Router();

router
    .post("/", controller.createOrder)
    .get("/active", controller.getActiveOrdersByAccountId)
    .get("/history", controller.getOrderHistoryByAccountId)
    .post("/close", controller.closeOrder);

module.exports = router;
