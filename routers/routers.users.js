const express = require("express");
const usersController = require("../controllers/controllers.users");

const router = express.Router();

router.get("/me", usersController.getUserInfo);

module.exports = router;
