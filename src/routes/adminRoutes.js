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
router.post('/add-department',adminController.addDepartment)
module.exports=router; 