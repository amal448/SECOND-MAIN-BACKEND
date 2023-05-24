const mongoose=require("mongoose")

const department=new mongoose.Schema({
    department:String
})

const departments=mongoose.model("Departments",department)
module.exports=departments 
