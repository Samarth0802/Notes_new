const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title:String,
    description:String
})

const userModel = mongoose.model('notes',userSchema)

module.exports = userModel