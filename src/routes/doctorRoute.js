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
router.get('/user/:userId',doctorAuth,doctorController.getUser)

router.get('/prescriptions/:userId',doctorAuth,doctorController.prescriptions);
router.get('/singleAppointment/:userId',doctorAuth,doctorController.singleAppointment)

router.post('/addprescription',doctorAuth,doctorController.addPrescription)
router.get('/deletePrescription/:prescriptionId',doctorAuth,doctorController.deletePrescription);


module.exports=router;