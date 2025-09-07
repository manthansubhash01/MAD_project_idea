const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    passwordHashed : {type : String, required : true}
},{timestamps : true});

module.exports = mongoose.Model('User', userSchema)