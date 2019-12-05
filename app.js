const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("./config/config");

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello from node app!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./routers/index")(app);

app.use((req, res, next) => {
    const err = new Error("Not found!");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (err) {
        console.log("Errors Handling", err);
        res.status(err.status || 500).json({
            error: {
                message: err.message
            }
        });
    }
});

app.listen(config.port, () => console.log(`Server is up on port ${config.port}!`));
