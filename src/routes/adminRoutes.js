const express=require("express")

const adminController=require("../controllers/adminController")
const adminAuth=require("../middlewares/adminAuth")
const router=express.Router()

router.post('/login',adminController.login)
router.post('/add-doctor',adminAuth,adminController.addDoctor);
router.get('/get-all-doctors',adminAuth,adminController.getallDoctors);
router.get('/get-all-users',adminAuth,adminController.getallUsers)
router.get('/get-doctor/:id',adminController.getDoctor)
router.post('/edit-doctor',adminController.editDoctor)
router.get('/apply-doctor',adminController.getApplicant)
router.get('/block-user/:id',adminController. blockUser)
router.get('/block-doctor/:id',adminController.blockDoctor)
router.post('/add-department',adminController.addDepartment)
router.get('/get-all-department',adminController.getAllDepartments)
router.get('/view-doctor-request/:id',adminController.getApplicantData)
router.patch('/approve-doctor/:id',adminController.doctorApproval)
router.delete('/decline-doctor/:id',adminController.RejectApproval)
// router.delete('/delete-dep/:id',adminController.deleteDepartment)
router.get('/edit-dep/:id',adminController.editDepartment)
router.post('/update-dep/:id',adminController.updateDepartment)

router.get('/weeklySales',adminController.getWeeklyReport)
router.get('/dailySales',adminController.getDailyReport)
router.get('/yearlySales',adminController.getYearlyReport)
router.get('/data-count',adminController.getAllDataCount)
router.get('/sales-monthly',adminController.getSalesForChart)


module.exports=router; 
