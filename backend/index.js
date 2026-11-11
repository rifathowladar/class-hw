require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/userModel')
const cors = require('cors')

app.use(express.json())
app.use(cors())

let port = process.env.PORT || 8000
mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("mongodb connected")})

let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

app.post('/registration',async (req,res)=>{
    let {fullname,email,password,confirmPassword,terms} = req.body
    if(!fullname || !email || !password || !confirmPassword || !terms){
        return res.status(400).json({
            success: false,
            message: "Please fill the all fields"
        })
    }
    if (!pattern.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        })
    }
    let existingUser = await User.findOne({email:email})
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exist"
        })
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password not match"
        })
    }

    let user = new User({
        fullname,
        email,
        password,
        confirmPassword,
        terms
    }).save()
    res.status(201).json({
        success: true,
        message: "Registration done"
    })
})


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})