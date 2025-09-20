const mongoose = require('mongoose')
mongoose.set("strictQuery", false)

const dbURI = process.env.DB_URI

async function connection(){
    try{
        await mongoose.connect(dbURI,{})
        console.log('Connected to Database')
    }catch(err){
        console.log('Error occured while connecting to database', err)
    }
}

module.exports = connection