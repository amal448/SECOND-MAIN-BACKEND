const Conversation=require("../routes/conversation")
const Conversations =require("../model/Conversation")


module.exports ={

// CreateConversation:async(req,res)=>{
//     console.log("@createconversation")
//     console.log(req.post)
//     const newConversation=new Conversations({
//         members:[req.body.senderId,req.body.receiverId]
//     })
//     try{

//         const savedConversation=await newConversation.save()
//         res.status(200).json(savedConversation)

//     }catch(error)
//     {
//         res.status(500).json(error)
//     }
// },


CreateConversation: async (req, res) => {
    try {
      // Check if there is a conversation already existing between the two members
      const existingConvo = await Conversations.findOne({
        members: { $all: [req.body.senderId, req.body.receiverId] },
      });

      if (existingConvo) {
        console.log(existingConvo, "--------");
        return res.status(200).json(existingConvo);
      }

      const newConversation = new Conversations({
        members: [req.body.senderId, req.body.receiverId],
      });

      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  },

























GetUserId:async(req,res)=>{
    console.log("at getuserIdmnjnjnk")
    console.log(req.params)
    try{
        const conversation=await Conversations.find({
            members:{$in : [req.params.userId]},
    
        });
        res.status(200).json(conversation)

    }catch(error)
    {
        res.status(500).json(error)
    }
},
checkExistance:async(req,res)=>{
    try {
        console.log("@checkExistanse")
        console.log(req.body)
        const {senderId,recieverId} = req.body;
        const checkExistence = await Conversations.find({senderId,recieverId});
        console.log("checkExistence",checkExistence)
        if(checkExistence.length ===0){
            console.log(" No conversation id already created")
          res.status(200).json({success:true,message:'No conversation id  exist'});
        }else{
            console.log(" Already conversation id created")

          res.status(200).json({success:false,message: 'User already exists'});
        }
        
      } catch (error) {
        return res.status(500).send({success:false,message:'something wrong'});
        
      }
}

}