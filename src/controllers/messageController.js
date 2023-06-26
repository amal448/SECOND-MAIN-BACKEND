// const Conversation=require("../routes/conversation")
const Message =require("../model/Message")


module.exports ={

    PostMessage:async(req,res)=>{
        const newMessage=new Message(req.body)
    
    try    {

        const savedMessage=await newMessage.save()
        res.status(200).json(savedMessage)
    }
    catch(error){
        res.status(500).json(error)
    }
    
    },
    GetMessage:async(req,res)=>{
        try{
            const messages=await Message.find({ conversationId:req.params.conversationId })
            res.status(200).json(messages)
      
        }
        catch(error)
        {
            res.status(500).json(error)
        }
    }


}