const mongoose=require("mongoose")

const Application =new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    mobile:String,
    dob:String,
    image:String,
    about:String,
    address:String,
    department:String,
    experience:String,
    CTC:Number,
    certificate:String,
    // age:String,
    Blocked:Boolean
})

const Applications=mongoose.model("Applications",Application)
module.exports=Applications 
