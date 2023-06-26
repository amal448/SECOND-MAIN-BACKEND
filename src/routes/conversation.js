const express=require('express')
// const Conversations =require('../models/Conversation')
const ConversationController=require('../controllers/conversationController')
const userAuth=require("../middlewares/userAuth")
const router=express.Router()

router.post('/',ConversationController.CreateConversation)
// router.get('/:userId',ConversationController.GetUserId)
router.get('/:userId',ConversationController.GetUserId)


module.exports =router