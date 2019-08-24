const express = require("express");
const authController = require("../controllers/controllers.authentication");
const User = require("../models/models.user");

const router = express.Router();

router.get("/token", (req, res) => {
    res.send("hehe");
});

router.post("/me", (req, res) => {
    const auth = req.auth;
    res.send(auth);
});

module.exports = router;
