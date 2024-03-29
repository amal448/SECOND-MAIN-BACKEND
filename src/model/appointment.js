const { ObjectId } = require("mongodb");
const mongoose=require("mongoose");

const Appointment=new mongoose.Schema({
    userId:ObjectId,
    doctorId:ObjectId,
    doctorName:String,
    department:String,
    date:Date,
    time:String,
    price:Number,
    payment_status:String,
    paymentOwner:String,
    paymentOwnerEmail:String,
    status:String
    
},
{ timestamps: true }
)
const Appointments=mongoose.model("appointment",Appointment)
module.exports =Appointments