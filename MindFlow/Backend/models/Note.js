const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
    title : {type : String},
    content : {type : String},
    folderId : {type : mongoose.Schema.ObjectId, ref : 'Folder', required : true},
    userId : {type : mongoose.Schema.ObjectId, ref : 'User', required : true},
    createdAt : {type : Date, default : Date.now}
})

module.exports = mongoose.model('Note', noteSchema)