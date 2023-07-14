const express=require('express')


const doctorController=require("../controllers/doctorController")
const userController=require('../controllers/userController')
const userAuth=require("../middlewares/userAuth")

const router=express.Router()

router.post("/signup",userController.signup)
router.post("/login",userController.login)
router.get('/get-all-doctors',userAuth, userController.getAllDoctors);
router.post('/apply-doctor',userAuth,doctorController.ApplyforDoctor)
router.get('/get-departments',userAuth,userController.getDepartments)
router.get('/activate-account/:token',userController.activetAccount)
router.get('/experience-doctors',userController.departmentexpdoc)
router.get('/department-doctors/:department/:page',userController.getdepartmentdoctors)
router.post('/doctor/checkAvailability',userController.checkAvailability)
router.get('/get-doctor/id:',userController.getSingleDoctor)
router.post('/create-checkout-session',userController.checkoutPayment)
router.post('/webhook', express.json({type: 'application/json'}),userController.webhook)
router.post('/forgot-password',userController.forgotPassword)
router.post('/reset-Password/:userId/:token',userController.resetPassword)
router.get('/foractivate-account/:userid/:token',userController.activetidtoken)
router.post('/razorpay',userController.RazorPayment)
router.get('/user/:userId',userController.getUser)
router.get('/bookinghistory/:userId',userAuth,userController.bookhistory)
module.exports=router;