const express = require('express')
const authMiddleware = require('../middleware/authmiddleware')
const User = require('../models/User')

const router = express.Router()


router.get('/profile', authMiddleware, async(req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-passwordHashed')
        res.json(user)
    }catch(err){
        res.status(500).json({ message: "Server error" });    
    }
})

module.exports = router