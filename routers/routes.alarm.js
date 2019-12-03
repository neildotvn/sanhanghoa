const express = require("express");
const controller = require("../controllers/controllers.alarm");

const router = express.Router();

router
    .get("/", controller.getAlarmsByUserId)
    .post("/", controller.createAlarm)
    .post("/:alarm_uid/enable", controller.enableAlarm)
    .post("/:alarm_uid/disable", controller.disableAlarm)
    .post("/:alarm_uid/delete", controller.deleteAlarm);

module.exports = router;
