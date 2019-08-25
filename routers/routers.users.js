const express = require("express");
const AuthController = require("../controllers/controllers.authentication");

const router = express.Router();

router.get("/me", AuthController.verify);

module.exports = router;
