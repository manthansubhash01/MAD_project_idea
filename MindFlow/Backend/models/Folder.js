const mongoose = require('mongoose')

const folderSchema = mongoose.Schema({
    name : {type : String, required : true},
    userId : {type : mongoose.Schema.ObjectId, ref : "User", required : true},
    description : {type : String},
    createdAt : {type : Date, default : Date.now}
})

module.exports = mongoose.model('Folder', folderSchema)