const mongoose=require("mongoose")

const conversation=new mongoose.Schema({
  
members: {
    type:Array
}

})

const Con=mongoose.model("Conversation",conversation)
module.exports=Con 
