const mongoose = require('mongoose')
mongoose.set("strictQuery", false)

const dbURI = process.env.DB_URI

async function connection(){
    try{
        await mongoose.connect(dbURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to Database')
    }catch(err){
        console.log('Error occured while connecting to database', err)
    }
}

module.exports = connection