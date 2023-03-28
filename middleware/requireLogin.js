const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../key")
const User = require('../models/user')

module.exports = async (req, res, next) => {
    const bearerToken = req.header('authorization');
    if(!bearerToken) {
        return res.status(401).json({error:"you must log in"})
    }
    try{
        if (typeof bearerToken !== 'undefined') {
            const bearer = bearerToken.split(' ');
            const token = bearer[1];
            const decoded = await jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        }
        else {
            res.status(400).send('Invalid token.');
        }
    }
    catch (err) {
        res.status(400).send('Invalid token.');
    }
}