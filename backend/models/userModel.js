const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    fullname:{
        type: String
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    terms:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model("User",userSchema)
