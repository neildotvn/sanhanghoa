const express = require("express");
const usersController = require("../controllers/controllers.users");

const router = express.Router();

router
    .get("/me", usersController.getUserInfo)
    .put("/me", usersController.updateUserInfo)
    .post("/push-token", usersController.setPushToken);

module.exports = router;
