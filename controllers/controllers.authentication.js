const model = require("../models/models.authentication");
const userModel = require("../models/models.user");

class AuthenticationController {
    static register(req, res) {
        const regInfo = {
            phone: req.body.phone,
            name: req.body.name,
            password: req.body.password
        };
        userModel
            .register(regInfo)
            .then(data => {
                console.log(data);
                res.status(200).send(data.rows[0]);
            })
            .catch(err => {
                console.log(err);
                res.status(406).send("Invalid input!");
            });
    }
}

module.exports = AuthenticationController;
