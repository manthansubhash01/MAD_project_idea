const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req,res) => {
    const {name, email, password} = req.body

    if(!name){
        return res.status(400).json({ error: "Please enter your name." })
    }

    if(!email){
        return res.status(400).json({ error: "Please enter your Email Address." })
    }

    if(!password){
        return res.status(400).json({ error: "Please enter the Password." })
    }

    try{
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            return res.status(400).json({ error: "User already exists." })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(password,salt)

        const newUser = await User.create({ name, email, passwordHashed })

        return res.status(201).json({ message : 'User registered successfully.', user : newUser })
    }catch(err){
        return res.status(500).json({ error: "Server error", details: err.message })
    }

}


const loginUser = async (req, res) => {
    const { email, password } = req.body

    if(!email){
        return res.status(400).json({ error: "Please enter your Email Address." })
    }

    if(!password){
        return res.status(400).json({ error: "Please enter the Password." })
    }

    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({ error: "User doesn't exist" })
        }

        const isValid = await bcrypt.compare(password, user.passwordHashed)

        if(!isValid){
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign(
            { id : user._id, email : user.email },
            process.env.JWT_SECRET,
            { expiresIn : '30d' }
        )

        console.log(token)
        return res.json({ message : 'Login successful', token})

    }catch(err){
        return res.status(500).json({ error: "Server error", details: err.message })
    }
}

module.exports = { registerUser, loginUser }