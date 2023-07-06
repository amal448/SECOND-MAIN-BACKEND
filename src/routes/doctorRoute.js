const express=require("express")

const doctorController=require("../controllers/doctorController")
const doctorAuth=require("../middlewares/doctorAuth");

const router=express.Router();
// router.post('/apply-post',doctorController.ApplyforDoctor)
router.post('/login',doctorController.login)
// router.get('/get-all-doctors',doctorAuth,doctorController.getAllDoctors)
router.put('/update-timeSlot',doctorAuth,doctorController.addDoctorTimeSlot)
router.get('/get-patients',doctorAuth,doctorController.getPatients)
router.get('/doctor/:doctorId',doctorController.getDoctor)
router.get('/Appointmentdata',doctorAuth,doctorController.getAppointments)
router.get('/getFullProfit/:id',doctorController.getFullPayment) 

module.exports=router;