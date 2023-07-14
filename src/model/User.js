const mongoose=require("mongoose")
const mongoosePaginate=require("mongoose-paginate")
const User=new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    mobile:String,
    dateOfBirth:String,
    gender:String,
    password:String,
    block:Boolean,
    active:Boolean,
    image:Object
})
User.plugin(mongoosePaginate)
const Users=mongoose.model("users",User)
module.exports=Users;