const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {join} = require('path')
const nowTime = require(join(__dirname, '..', 'helpers', 'nowTime.js'))


const contentSchema = new Schema({
   title:{type:String, require},
   imgURL:{type:String, require},
   content:{type:String, require},
   author:{type:String, require},
   date:{type:String, default:nowTime()}
})



const Contents = mongoose.model('Contents', contentSchema);
module.exports = Contents