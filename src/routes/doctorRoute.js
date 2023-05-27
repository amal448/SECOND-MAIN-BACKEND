const express=require("express")

const doctorController=require("../controllers/doctorController")
const doctorAuth=require("../middlewares/doctorAuth");

const router=express.Router();
// router.post('/apply-post',doctorController.ApplyforDoctor)
router.post('/login',doctorController.login)
// router.get('/get-all-doctors',doctorAuth,doctorController.getAllDoctors)
module.exports=router;