const express = require("express");
const model = require("../controllers/controllers.authentication");

const router = express.Router();

router.post("/register", model.register).post("/login", model.login);

module.exports = router;
