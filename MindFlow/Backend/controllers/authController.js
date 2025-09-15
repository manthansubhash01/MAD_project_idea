const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req,res) => {
    const {name, email, password} = req.body

    if(!name){
        res.status(400).send('Please enter your name.')
    }

    if(!email){
        res.status(400).send('Please enter your Email Address.')
    }

    if(!password){
        res.status(400).send('Please enter the Password.')
    }

    try{
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            res.status(400).send('User already exists.')
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(password,salt)

        const newUser = await User.create({ name, email, passwordHashed })

        res.status(201).json({ message : 'User registered successfully.', user : newUser })
    }catch(err){
        res.status(500).send('Server error :',err)
    }

}


const loginUser = async (req, res) => {
    const { email, password } = req.body

    if(!email){
        res.status(400).send('Please enter your Email Address.')
    }

    if(!password){
        res.status(400).send('Please enter the Password.')
    }

    try{
        const user = await User.findOne({email})

        if(!user){
            res.status(400).send("User doesn't exist")
        }

        const isValid = await bcrypt.compare(password, user.passwordHashed)

        if(!isValid){
            res.status(400).send('Invalid Credentials')
        }

        const token = jwt.sign(
            { id : user._id, email : user.email },
            process.env.JWT_SECRET,
            { expiresIn : '30d' }
        )

        res.json({ message : 'Login successful', token})

    }catch(err){
        res.status(500).send(err)
    }
}

module.exports = { registerUser, loginUser }