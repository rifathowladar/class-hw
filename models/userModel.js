const mongoose = require('mongoose');
const { Schema } = mongoose;

let userSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("user", userSchema)