const validator = require("validator");

module.exports = class Validator {
    static validateAuth(inputs) {
        let message;
        let isValid = true;
        const keys = ["phone", "password"];
        for (let key of keys) {
            console.log(this, inputs[key]);
            if (!inputs[key]) {
                message = `${key} must not be null!`;
                isValid = false;
                break;
            }
            if (!validator.isAscii(inputs[key])) {
                message = "Input must be Ascii!";
                isValid = false;
                break;
            }
        }
        if (inputs.phone && !validator.isMobilePhone(inputs.phone, "vi-VN")) {
            message = "Phone number invalid!";
            isValid = false;
        }
        return {
            isValid,
            message
        };
    }
};
