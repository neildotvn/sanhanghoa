const express = require("express");
const authController = require("../controllers/controllers.authentication");

const router = express.Router();

router
    .post("/register", authController.register)
    .post("/login", authController.login);

module.exports = router;
