const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    passwordHashed : {type : String, required : true},
    image: { type: String, default: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F018%2F765%2F757%2Foriginal%2Fuser-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg&f=1&nofb=1&ipt=cf5dba5af2e2209695e811af2456ae3290e6c830a14e5ccc15e4a8f063fee78e" },
},{timestamps : true});

module.exports = mongoose.model('User', userSchema)