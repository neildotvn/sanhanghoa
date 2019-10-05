const express = require("express");
const AccountController = require("../controllers/controllers.account");

const router = express.Router();

router.get("/:user_uid", AccountController.getAccountInfoByUserId);

module.exports = router;
