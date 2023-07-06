// import cloudinary from "../utils/cloudinary";
const {checkPassword} = require("../helpers/userHelper");
const moment=require("moment")

const jwt =require("jsonwebtoken")
const passwordHash=require("password-hash")
const Doctors = require("../model/Doctor")
const Users=require("../model/User")
const Applications=require("../model/Doctorapply")
const { EMAILREGEX, checkPasswordHasSpecialCharacters, stringHasAnyNumber} = require("../utils/constants");
const Appointments = require("../model/appointment");
const { default: mongoose } = require("mongoose");




// const { checkPassword } = require("../helpers/userHelper");



module.exports={




    ApplyforDoctor:async(req,res)=>{

        console.log("Amaldihufhufi");
        let errorMessages={
            firstName:"",lastName:"",email:"",mobile:"",dob:"",image:"",about:"", address:"",department:"",experience:"",CTC:"",certificate:"",fees:"",startTime:"",endtime:""
        }
    

            const {firstName,lastName,email,mobile,department,dob,address,about,experience,image,certificate,CTC,startTime,endTime,fees}=req.body
            console.log(req.body);
        const formattedStartedTime= moment(startTime,"hh:mmA")
        const formattedEndTime=moment(endTime,"hh:mmA")

        console.log("LLLLLLLLLLLLLLLLLLL")
        console.log(formattedStartedTime);
        console.log(formattedEndTime);

        function getTimesBetween(start,end){
            const times=[]
            let currentTime =moment(start);

            while(currentTime.isBefore(end)) {
                times.push(currentTime.format("h:mm A"))
                currentTime.add(1,'hour')
            }

            return times;
        }

        const timings= getTimesBetween(formattedStartedTime ,formattedEndTime)







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
                            new Doctors({...req.body,block:true,timings,status:"pending", doctorTimings:timeSlots }).save().then(async (response)=>{
    
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
            Doctors.find({email,block:false}).then(async (doctor)=>{
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
  
    addDoctorTimeSlot:async (req,res) =>{

        console.log("kerrrrrriiiii");
        const doctorId = req.doctor;
        console.log(doctorId);
        console.log("thththththtfhtt");

        console.log(req.body);

        const{timings,interval} =req.body;
        try
        { 
            function generateTimeSlots(startTime,endTime,interval)
            {
                const timeSlot=[]
                let currentTime=moment(startTime,'h:mm A');
            

                while(currentTime < moment(endTime,'h:mm A')){

                    console.log("currentTime..........",currentTime)
                    console.log("endTime.......",endTime)
                    console.log("startTime......",startTime)


                    timeSlot.push(currentTime.format('h:mm A'));
                    currentTime.add(interval,'minutes')
                }

                return timeSlot

            }

            function generateDoctorTimings(existingTimings,updatedTimings,interval)
            {
                const doctorTimings={...existingTimings};

                for(const timing of updatedTimings)
                {
                    const {day,startTime,endTime} =timing;

                    if(startTime && endTime)
                    {
                        const timeSlots=generateTimeSlots(startTime,endTime,interval);
                        doctorTimings[day]=timeSlots
                    }


                }
                return doctorTimings;
            }
            const existingDoctor=await Doctors.findById(doctorId)
            const doctorTimings =generateDoctorTimings(existingDoctor.doctorTimings,timings,interval)
            const updateTime =await Doctors.findByIdAndUpdate(doctorId,{doctorTimings})
      
        res.status(200).json(updateTime);
            
        }
        catch (error)
        {
        res.status(500).json({ err: "Can't update the time slots" });

        }
    },


    getPatients:async(req,res)=>{
 
        try{ 

            let doctorId=req.doctor
            console.log("doctorId",doctorId)
    
    let userIds=await Appointments.distinct("userId",{doctorId})  
    console.log("userIds is here in appointment", userIds) 
    
    let data= await Users.find({_id:{$in:userIds}}).select('-password -mobile')
            console.log("data is getPatients is here",data)
    res.status(200).send(data);

        }
        catch(error){
            res.status(500).send("Unable to fetch user data")
        }
    
    },
    getAppointments:async(req,res)=>{
    
        try
        {
            let doctorId=req.doctor

            let Appointmentdata=await Appointments.find({doctorId}).populate({
                path:'userId',
                select:['-password','-tokens']
            }).select(" doctorId doctorName payment_status department date time price paymentOwner paymentOwnerEmail createdAt updatedAt __v")
          console.log(Appointmentdata)
            res.send(Appointmentdata)
        }
        catch(error) {
            res.send("can't find appointments")
        

        }



    },
    
    getDoctor: (req, res) => {
        console.log("00000000000000000000000000000000000000000000000000000000000000000000000000")
        try{
          
          const {doctorId} =req.params
          console.log(doctorId)
          Doctors.find({ _id: doctorId }).then((response) => {
            console.log("poooooooooooooooooooooooooooooooooooooooooooooo", response);
            res.status(200).json({ doctor: response });
          });
        }
        catch(error)
        {
          console.log(error)
        }
   
},
getFullPayment:async(req,res)=>{
const {id}=req.params
try{
    const payment =await Appointments.aggregate([
        {
            $match :{
                doctorId: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $group:{
                _id:null,
                total: {$sum: "$price"}
            }
        }
    ])
    res.status(200).json(payment);

}catch (error) {
       
    return res.status(500).json({ err: "can't access data" })

}
}
}