const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/dbConnection')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoute')

const PORT = process.env.PORT || 3001

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/user', profileRoutes)

app.get('/',(req,res) => {
    res.send('Server is running.')
})

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})
