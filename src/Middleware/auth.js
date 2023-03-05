const jwt = require('jsonwebtoken');
const Register = require("../Models/registerModel")


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwtCookie;
        console.log(token)
        const verifyCookie = jwt.verify(token, process.env.Secret_key);
        //console.log(verifyCookie);
        const user = await Register.findById(verifyCookie.id);
        //console.log(user.firstname);
        //req.firstname=user.firstname;
        req.token = token;
        req.user = user;

        //await user.save();
        next();
    } catch (e) {
        res.status(401).send(e);
    }
}

module.exports = auth;

