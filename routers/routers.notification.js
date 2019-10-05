const express = require("express");
const controller = require("../controllers/controllers.notification");

const router = express.Router();

router.get("/", controller.getAllNotifications);

module.exports = router;
