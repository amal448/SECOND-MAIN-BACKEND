// const Conversation=require("../routes/conversation")
const Conversations =require("../model/Conversation")


module.exports ={

CreateConversation:async(req,res)=>{

    const newConversation=new Conversations({
        members:[req.body.senderId,req.body.receiverId]
    })
    try{

        const savedConversation=await newConversation.save()
        res.status(200).json(savedConversation)

    }catch(error)
    {
        res.status(500).json(error)
    }
},
GetUserId:async(req,res)=>{
    console.log("at getuserIdmnjnjnk")
    console.log(req.params)
    try{
        const conversation=await Conversations.find({
            members:{$in : [req.params.userId]},
    
        });
        console.log("conversation",conversation)
        res.status(200).json(conversation)

    }catch(error)
    {
        res.status(500).json(error)
    }
}


}