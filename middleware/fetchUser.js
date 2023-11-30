const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const path = require('path');
// path to .env file
dotenv.config({ path: path.join(__dirname, '../.env') })
const JWTSECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
    // get the userfrom the jwt token and add to req. object
    const token = req.header('Authorization');
    // delete req.headers['x-powered-by'];
    console.log(token);
    if (token) {
        try {
            const currentToken = token.split(" ")[1];
            const data = jwt.verify(currentToken, process.env.JWT_SECRET);
            req.user = data.user
            next();
        } catch (error) {
            // res.send(error);
            res.status(401).send({ error: "please authenticate using a valid token" })
        }
    } else {
        res.status(401).json({ message: "Unauthorized User" })
    }

}

module.exports = fetchUser;
