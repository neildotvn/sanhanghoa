const express = require("express");
const controller = require("../controllers/controllers.prices");

const router = express.Router();

router.get("/", controller.getAllPrices);

module.exports = router;
