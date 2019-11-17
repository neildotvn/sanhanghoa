const express = require("express");
const Redis = require("ioredis");
const redis = new Redis();
const path = require("path");

const router = express.Router();

var appDir = path.dirname(require.main.filename);

router
    .post("/", (req, res) => {
        console.log(req.body);
        const password = req.body.password;
        if (password != "3415") res.end("Sai mat khau roi anh oi!");
        const token = req.body.token;
        redis
            .set("tincaphe-token", token)
            .then(() => res.send("thanh cong"))
            .catch(err => {
                console.log(err);
                res.end("that bai");
            });
    })
    .get("/", (req, res) => res.sendFile(path.join(appDir + "/static/tincaphe-token.html")));

module.exports = router;
