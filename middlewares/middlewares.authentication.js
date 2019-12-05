const jwt = require("jsonwebtoken");

const jwtSecret = "hehe";

class AuthMiddleware {
    static async authenticate(req, res, next) {
        const auth = await AuthMiddleware.processToken(req);
        // console.log(this, auth);

        if (auth.payload) {
            req.auth = auth.payload;
            next();
        } else {
            res.status(auth.status).send(auth.message);
        }
    }

    static processToken(req) {
        const result = {};
        // console.log(req.headers);
        if (!req.headers["authorization"]) {
            result.status = 401;
            result.message = "Token is empty!";
            return result;
        }
        const splitedHeader = req.headers["authorization"].split(" ");
        const token = splitedHeader[1];
        const type = splitedHeader[0];
        switch (type) {
            case "Bearer":
                try {
                    result.status = 200;
                    result.payload = jwt.verify(token, jwtSecret);
                } catch (err) {
                    result.status = 401;
                    result.message = "Authentication failed!";
                }
                break;
            default:
                result.status = 401;
                result.message = "Token is invalid, must be Bearer!";
                break;
        }
        return result;
    }

    static generateToken(user) {
        return jwt.sign(user, jwtSecret);
    }

    static verify(req) {
        return this.processToken(req);
    }

    static verifyInputsNotNull(inputs) {
        for (key in inputs) {
            if (!inputs[key]) return false;
        }
        return true;
    }
}

module.exports = AuthMiddleware;
