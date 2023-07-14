const mongoose=require("mongoose")
const mongoosePaginate=require("mongoose-paginate")

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
    startTime:String,
    endTime:String,
    timings:Array,
    fees:Number,
    password:String,
    block:Boolean,
    status:String,
    doctorTimings:Object
})
Doctor.plugin(mongoosePaginate)

const Doctors=mongoose.model("doctors",Doctor)
module.exports=Doctors 
