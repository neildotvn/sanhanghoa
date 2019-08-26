module.exports = {
    omitEmpty: obj => {
        const newObj = {};
        for (const key in obj) {
            if (obj[key]) {
                newObj[key] = obj[key];
            }
        }
        console.log("omitEmpty", newObj);

        return newObj;
    }
};
