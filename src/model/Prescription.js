const { ObjectId } = require("mongodb")
const mongoose=require("mongoose")

const prescriptions=new mongoose.Schema({
    userId:ObjectId,
    doctorId:ObjectId,
    username:String,
    title:String,
    description:String,

},
{timestamps:true}
)

const Prescription=mongoose.model("prescriptions",prescriptions)
module.exports=Prescription 
