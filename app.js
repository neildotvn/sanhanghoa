require("dotenv").config();

const express = require("express");
const userRouter = require("./routers/user");
const bodyParser = require("body-parser");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from node app!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./routers/index")(app);

app.listen(process.env.PORT, () =>
    console.log(`Server is up on port ${process.env.PORT}!`)
);
