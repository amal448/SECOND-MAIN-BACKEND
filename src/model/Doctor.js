const mongoose=require("mongoose")

const Doctor=new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    mobile:String,
    dob:String,
    image:Object,
    about:String,
    address:String,
    department:String,
    experience:String,
    CTC:Number,
    startTime:Number,
    endTime:Number,
    timings:Array,
    fees:Number,
    password:String,
    Blocked:Boolean
})

const Doctors=mongoose.model("doctors",Doctor)
module.exports=Doctors 