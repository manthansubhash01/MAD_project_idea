const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/dbConnection')

const PORT = process.env.PORT || 3001

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    res.send('Server is running.')
})

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})
