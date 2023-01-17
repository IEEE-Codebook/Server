const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../key")
const mongoose = require("mongoose")
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    // if(!authorization) {
    //     return res.status(401).json({error:"you must log in"})
    // }
    const token = authorization.replace("Bearer ", "")
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2M2Njg0MjI4NGQ1YzhiOTkyMDlkOWUiLCJpYXQiOjE2NzM5NTI1Mjd9.FFfKN2d-YAVQPuj8ypRkRpRoCY-92_igM9X-ZVpItVc"
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if(err) {
            return res.status(401).json({error:"you must log in"})
        }
        const {_id} = payload
        User.findById(_id).then(userData => {
            req.user = userData
            next()
        })
    })   
}