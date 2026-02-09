const mongoose = require('mongoose')

async function connectToDB(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected TO DB")
    })
    .catch(err=>{
        console.log("Error ",err)
    })
}

module.exports = connectToDB