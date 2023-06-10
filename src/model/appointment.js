const { ObjectId } = require("mongodb");
const mongoose=require("mongoose");

const Appointment=new mongoose.Schema({
    userId:ObjectId,
    doctorId:ObjectId,
    doctorName:String,
    doctorImage:String,
    department:String,
    date:Date,
    time:String,
    price:Number,
    payment_status:String,
    paymentOwner:String,
    paymentOwnerEmail:String
    
    // firstName:String,
    // lastName:String,
    // email:String,
    // mobile:String,
    // gender:String,
    // dob:String,
    // appointmentTime:String,
    // appointmentDate:Date,
    // age:String,
    // address:String,
    // status:String,
})
const Appointments=mongoose.model("appointment",Appointment)
module.exports =Appointments