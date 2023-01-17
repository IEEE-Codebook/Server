const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../key")

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password) {
        return res.status(422).json({error:"Enter all fields"})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({error:"Email already exists"}) 
        }
        bcrypt.hash(password, 15)
        .then(hpass => {
            const user = new User({
                email, 
                password: hpass, 
                name
            })
    
            user.save()
            .then(user => {
                res.json({mesage:"Saved!"})
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch) {
                //res.json({success: "Signed In Successfully"})
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                res.json({token})
            }
            else{
                res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        }) 
    })
})

module.exports = router