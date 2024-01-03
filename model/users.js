const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
   email:{type:String, require},
   username:{type:String, require},
   password:{type:String, require}
})



const Users = mongoose.model('Users', userSchema)


module.exports = Users