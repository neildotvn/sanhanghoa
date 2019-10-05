const express = require("express");
const controller = require("../controllers/controllers.authentication");

const router = express.Router();

router.post("/register", controller.register).post("/login", controller.login);

module.exports = router;
