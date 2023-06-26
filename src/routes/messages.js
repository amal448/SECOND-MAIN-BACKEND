const express=require('express')
const messageController=require("../controllers/messageController")

const router=express.Router()

router.post('/',messageController.PostMessage)
router.get('/:conversationId',messageController.GetMessage)
module.exports =router