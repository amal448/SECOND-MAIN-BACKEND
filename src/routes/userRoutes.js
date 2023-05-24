const express=require('express')


const doctorController=require("../controllers/doctorController")
const userController=require('../controllers/userController')
const userAuth=require("../middlewares/userAuth")

const router=express.Router()

router.post("/signup",userController.signup)
router.post("/login",userController.login)
router.get('/get-all-doctors', userController.getAllDoctors);
router.post('/apply-doctor',doctorController.ApplyforDoctor)

module.exports=router;