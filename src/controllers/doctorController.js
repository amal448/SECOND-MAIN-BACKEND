// import cloudinary from "../utils/cloudinary";
const {checkPassword} = require("../helpers/userHelper");


const jwt =require("jsonwebtoken")
const passwordHash=require("password-hash")
const Doctors = require("../model/Doctor")
const Applications=require("../model/Doctorapply")
const { EMAILREGEX, checkPasswordHasSpecialCharacters, stringHasAnyNumber} = require("../utils/constants");




// const { checkPassword } = require("../helpers/userHelper");



module.exports={




    ApplyforDoctor:async(req,res)=>{

        let errorMessages={
            firstName:"",lastName:"",email:"",mobile:"",dob:"",image:"",about:"", address:"",department:"",experience:"",CTC:"",certificate:""
        }
    

            const {firstName,lastName,email,mobile,department,dob,address,about,experience,image,certificate,CTC}=req.body
    
            if(firstName==""||lastName==""||email==""||mobile==""|| department==""||dob=="" ||address==""||image==""||about==""||experience==""||certificate=="" ||CTC=="")
            {
                for(const key in req.body)
                {
                    if(req.body[key] =="")
                    {
                        errorMessages={...errorMessages,[key]:"please provide" + key}
                    }
                    else
                    {
                        delete errorMessages[key]
                    }
                }
            
                res.status(406).json({...errorMessages})
                return 
            }
              if (!EMAILREGEX.test(email))
               {
                return res.status(406).json({ email: "invalid email address" });
                }
              if (!stringHasAnyNumber(mobile))
               {
                return res.status(406).json({ mobile: "invalid mobile number" });
               }
            
               try
               {
                    
                    // Applications.find({email}).then((response)=>{
                    //     if(response.length >0)
                    //     {
                    //         return  res.status(409).json({email:"Account Already exists"})
                    //     }
                    //     else{
                    //         console.log("res.body",response)
                    //         new Applications({...req.body}).save().then(async (response)=>{
    
                    //             return res.status(200).json({message:"Approval is pending"})
                    //         })
    
                    //     }
                    // })
                    Doctors.find({email}).then((response)=>{
                        if(response.length >0)
                        {
                            return  res.status(409).json({email:"Account Already exists"})
                        }
                        else{
                            console.log("res.body",response)
                            new Doctors({...req.body,block:true}).save().then(async (response)=>{
    
                                return res.status(200).json({message:"Approval is pending"})
                            })
    
                        }
                    })
                   
               }catch (error){
                    res.status(500).json({err:"Some errror is occured"})
               }
    
    },

    login:async(req,res)=>{
        const {email,password}=req.body

        let errMessage={
            email:"",
            password:""
        }
        console.log(req.body)

        if (email=="" || password=="") {
            for(const key in req.body)
            {
                if(req.body[key] =="")
                {
                    errMessage[key]="please Provide" +key
                }
                else
                {
                    delete errMessage[key]
                }
            }
            return res.status(406).json({...errMessage})
        }else {
            Doctors.find({email}).then(async (doctor)=>{
                console.log("hi",doctor)
                if(doctor.length <=0)
                {
                    return res.status(406).json({type:"username",message:"specified data not found"})
                }
                else {
                try{

                    doctor=doctor[0]
                    console.log("doctor",doctor)
                    if(checkPassword(password,doctor.password))
                    {
                        const token = jwt.sign({ ...doctor }, process.env.KEY);
                        return res.status(200).json({ token, doctor });
                    }
                    else{
                        return res.status(401).json({type:"password",message: "incorrect password"})
                    }
                }catch(error){
                    console.log(error)
                    return res.status(500).json({message:error.message})
                }
                }
            })

        
        }
    },
    






    // getAllDoctors :(req,res)=>{
    //     return new Promise((resolve,reject)=>{
    //         Doctors.find({}).then(response => {
    //             for(let i=0;i< response.length;i++)
    //             {
    //                 delete response[i].password
    //             }
    //             res.status(200).json({ doctors:response})
    //         })
    //     })
    // }
}