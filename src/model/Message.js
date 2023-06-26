const mongoose=require("mongoose")

const Message=new mongoose.Schema({
  
conversationId:{
    type:String
},
sender:{
    type:String
},
text:{
    type:String
},
},
{timestamps:true}

)

const Con=mongoose.model("Message",Message)
module.exports=Con 
