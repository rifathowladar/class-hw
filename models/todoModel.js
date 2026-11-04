const mongoose = require('mongoose');
const { Schema } = mongoose;

let todoSchema = new Schema({
    task:{
        type: String,
        require: true,
    },
    priority: {
        type: String,
        enum: ["low", "moderate", "high"],
        default: "low"
    }
})

module.exports = mongoose.model("Task", todoSchema)