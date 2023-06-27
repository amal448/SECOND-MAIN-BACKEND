const mongoose=require("mongoose");

const Appointment=new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    mobile:String,
    gender:String,
    dob:String,
    appointmentTime:String,
    appointmentDate:Date,
    doctorName:String,
    department:String,
<<<<<<< HEAD
    date:Date,
    time:String,
    price:Number,
    payment_status:String,
    paymentOwner:String,
    paymentOwnerEmail:String
    
    
},
{ timestamps: true }
)
const Appointments=mongoose.model("appointment",Appointment)
=======
    age:String,
    address:String,
    status:String,
    userId:String
})
const Appointments=mongoose.model("appointment")
>>>>>>> parent of fe58e5b (payment started)
module.exports =Appointments