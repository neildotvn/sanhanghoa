require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

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
    console.log(err);
    res.status = err.status || 500;
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(process.env.PORT, () =>
    console.log(`Server is up on port ${process.env.PORT}!`)
);
