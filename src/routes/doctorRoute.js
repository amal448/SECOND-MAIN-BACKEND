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
router.get('/getFullProfit/:doctorId',doctorController.getFullPayment) 
router.get('/monthly-report/:doctorId',doctorAuth,doctorController.monthlyReport)
router.get('/weekly-report',doctorAuth,doctorController.weeklyReport)
router.get('/monthly-report',doctorController.monthlyReport);
router.get('/daily-report',doctorAuth,doctorController.dailyReport);
router.get('/yearly-report',doctorAuth,doctorController.getYearlyReport);


module.exports=router;