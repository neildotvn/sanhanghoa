const express = require("express");
const { getAccountInfo } = require("../controllers/controllers.account");

const router = express.Router();

router.get("/", getAccountInfo);

module.exports = router;
