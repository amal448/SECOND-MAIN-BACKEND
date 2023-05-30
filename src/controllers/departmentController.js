const { model } = require("mongoose")
const Department=require("../model/Department")

model.exports ={

    createDepartment:async(req,res)=>{
    
        try{
            const department=req.body
            const lowerCaseDepartment=department.trim().toUppercase
            const checkDepartment=Department.findOne({lowerCaseDepartment})
    
            if(!checkDepartment){
    
                const newDepartment= new Department({
                    department:lowerCaseDepartment
                });
                newDepartment.save().then(async ()=>{
                    const departments= await Department.find({})
                    res.status(200).json(departments)
                }).catch((err)=>{
                    console.log(err);
                    res.status(500).json({err:"can't add department"})
                })
            } else{
                res.status(500).json({err :"department already exists"})
            }
        } catch(error){
        res.status(500).json({ERR:"can't create department"})
       }
    } ,
    
    getAllDepartments: async(req,res)=>{

        try{
            const departments= await Departments.find({})
        if(departments){
            res.status(200).json(departments)
        }
        else {
            res.status(500).json({err:"SOMETHING WRONG"})
        }

        }catch(error){
            res.status(500).json({err:"Something wrong here"})
        }
    },
    deleteDepartment:async(req,res)=>{
        try{
            const{id}=req.params;
            const Deldepartment=Departments.findByIdAndDelete(id);

            if(Deldepartment){

                const departments=await Departments.find({})
                res.status(200).json(departments)
            }else
            {
                res.status(500).json({err:"deletion failed"})
            }
        }
        catch(error){
                res.status(500).json({err:"can't delete department"})
        }
    },
}