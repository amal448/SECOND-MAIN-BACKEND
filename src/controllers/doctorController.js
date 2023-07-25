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
const prescription=require("../model/Prescription");
const Prescription = require("../model/Prescription");



// const { checkPassword } = require("../helpers/userHelper");



module.exports={




    ApplyforDoctor:async(req,res)=>{

        console.log("Amaldihufhufi");
        let errorMessages={
            firstName:"",lastName:"",email:"",mobile:"",dob:"",image:"",about:"", address:"",department:"",experience:"",CTC:"",certificate:"",fees:"",startTime:"",endtime:"",password:""
        }
    

            const {firstName,lastName,email,mobile,department,dob,address,about,experience,image,certificate,CTC,startTime,endTime,fees,password}=req.body
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







            if(firstName==""||lastName==""||email==""||mobile==""|| department==""||dob=="" ||address==""||image==""||about==""||experience==""||certificate=="" ||fees=="")
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
                            // new Doctors({...req.body,block:true,timings,status:"pending", doctorTimings:timeSlots }).save().then(async (response)=>{
    
                            //     return res.status(200).json({message:"Approval is pending"})
                            // })
                             req.body.password = passwordHash.generate(password);
                            new Doctors({...req.body,block:true,timings,status:"pending" }).save().then(async (response)=>{
    
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
                    console.log("startTime......",startTime)
                    console.log("endTime.......",endTime)


                    timeSlot.push(currentTime.format('h:mm A'));
                    currentTime.add(interval,'minutes')
                }

                return timeSlot

            }

            function generateDoctorTimings(existingTimings,updatedTimings,interval)
            {
                const doctorTimings={...existingTimings};
                console.log("doctorTimings...............",doctorTimings)
                for(const timing of updatedTimings)
                {
                    const {day,startTime,endTime} =timing;

                    if(startTime && endTime)
                    {
                        const timeSlots=generateTimeSlots(startTime,endTime,interval);
                      console.log("timeSlots122121212121212",timeSlots)
                      console.log("dayyyyyyyyyyyyy",day)
                        doctorTimings[day]=timeSlots
                    }


                }
                return doctorTimings;
            }
            const existingDoctor=await Doctors.findById(doctorId)
            const doctorTimings =generateDoctorTimings(existingDoctor.doctorTimings,timings,interval)
            console.log("doctorTimings lasttttttttttttttt",doctorTimings)
            const updateTime =await Doctors.findByIdAndUpdate(doctorId,{doctorTimings})
            console.log("updateTimeeeeeeeeeeeeeeeeee",updateTime)
      
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

            let Appointmentdata=await Appointments.find({doctorId}).sort({ createdAt: -1 }).populate({
                path:'userId',
                select:['-password','-tokens']
            }).select(" doctorId doctorName payment_status department date time price paymentOwner paymentOwnerEmail createdAt updatedAt __v")
          console.log("Appointmentdata of respected doctor",Appointmentdata)
            res.send(Appointmentdata)
        }
        catch(error) {
            res.send("can't find appointments")
        

        }



    },
    
    getDoctor:async (req, res) => {
        console.log("00000000000000000000000000000000000000000000000000000000000000000000000000")
        try{
          
          const {doctorId} =req.params
          console.log(doctorId)
          Doctors.find({ _id: doctorId }).then((response) => {
            console.log("poooooooooooooooooooooooooooooooooooooooooooooo", response);
            res.status(200).json({ doctor: response });
          }).catch((err)=>{
            console.log(err)
          });
        }
        catch(error)
        {
          console.log(error)
        }
   
},
getFullPayment:async(req,res)=>{
const {doctorId}=req.params
try{
    const payment =await Appointments.aggregate([
        {
            $match :{
                doctorId: (doctorId)
            }
        },
        {
            $group:{
                _id:null,
                total: {$sum: "$price"}
            }
        }
    ])
    console.log("PAYMENTTTTTTTTTTT",payment)
    res.status(200).json(payment);

}catch (error) {
       console.log(error)
    return res.status(500).json({ err: "can't access data" })

}
},
monthlyReport:async(req,res)=>{
    try{
        console.log("montlyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
        const {doctorId} =req.params
        console.log("doctorId",doctorId)
        const result =await Appointments.aggregate([
            {
                $match :{
                    doctorId:(doctorId)
                }
            },
            {
                $group :{
                    _id:{
                        $month:"$date"
                    },
                    totalAmount: {
                        $sum: "$price"
                    }
                }
            },
            {
                $project :{
                    _id:0,
                    month:"$_id",
                    totalAmount:1
                }
            },
            {
                $group:{
                    _id:null,
                    data:{
                        $push:{
                            month:"$month",
                            totalAmount:"$totalAmount"
                        }
                    }
                }
            },
            {
                $unwind :{
                    path:"$data",
                    includeArrayIndex:"index",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $group:{
                    _id:"$data.month",
                    totalAmount:{
                        $max:"$data.totalAmount"
                    }
                }
            },
            {
                $sort:{
                    _id:1
                }
            },
            {
                $project:{
                    _id:0,
                    month:"$_id",
                    totalAmount:{
                        $ifNull: ["$totalAmount",0]
                    }
                }
            }
        ])

        
        const months = Array.from(Array(12), (_, i) => i + 1); // Generate an array of months (1 to 12)
       
        const prices = months.map(month => {
            const resultItem = result.find(item => item.month === month);
            return resultItem ? resultItem.totalAmount : 0;
        });
        console.log("priceeeeee monthhhhhhhhhhhh",prices)
        res.status(200).send(prices);
    } catch (error) {
    
        res.status(400).json({ error: "Unable to retrieve the data" });
    }
},
weeklyReport:async(req,res)=>{
    try {
        console.log("weeklyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")

        const doctorId = req.doctor;

        const result = await Appointments.aggregate([
            {
                $match: {
                    doctorId: (doctorId)
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    totalSales: { $sum: "$price" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        const salesByDay = Array.from({ length: 7 }, (_, index) => {
            const dayData = result.find(data => data._id === index + 1);
            return dayData ? dayData.totalSales : 0
        });
        console.log("salesByDay....",salesByDay)
       
        res.status(201).json(salesByDay)
    } catch (error) {
      
        res.status(500).json({ err: "can't create data" })

    }
},
dailyReport:async(req,res)=>{
    try {
        const doctorId = req.doctor;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const result = await Appointment.aggregate([
          {
            $match: {
              date: { $gte: today },
              doctorId: (doctorId),
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$price" },
            },
          },
        ]);
    
        const dailyTotal = result.length > 0 ? result[0].total : 0;
        console.log("dailyTotal....",dailyTotal)
        res.status(201).json(dailyTotal);
      } catch (error) {
      
        res.status(400).json({ err: "Can't find the data" });
      }  
},
getYearlyReport:async(req,res)=>{
    const doctorId = req.doctor;
    console.log("yearly report///////")
    try {
        const result = await Appointments.aggregate([
            {
                $match: {
                    doctorId: (doctorId)
                }
            },
            {
                $group: {
                    _id: { $year: "$createAt" },
                    totalSales: { $sum: "$price" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        const yearlyReport = result.map(yearData => yearData.totalSales);
        console.log("yearlyReporttttttttttttt",yearlyReport)
        res.status(201).json(yearlyReport)

    } catch (error) {
        res.status(400).json({ err: "can't update the data" })

    }
},
prescriptions :async(req,res)=>{
    console.log("entered");
    const {userId}=req.params
    const doctorId = req.doctor;
    const docId = doctorId.toString();

    try {


        const newPrescription = await prescription.find({
            doctorId: docId,
            userId: (userId),
        });
    console.log("newPrescription",newPrescription);

        res.status(200).json(newPrescription);

    } catch (error) {
       
        return res.status(401).json({ err: "can't create prescription" })
    }
},
getUser: (req, res) => {
    console.log(
      "00000000000000000000000000000000000000000000000000000000000000000000000000"
    );
    try {
      const { userId } = req.params;
      console.log("id", userId);
      Users.find({ _id: userId }).then((response) => {
        console.log(
          "poooooooooooooooooooooooooooooooooooooooooooooo",
          response)
          res.status(200).json({ alluser: response });
        
      }).catch((error)=>{
        console.log(error)
      })
    } catch (error) {
      console.log(error);
    }
  },
  singleAppointment:async(req,res)=>{
    console.log("mmmmmmmmmmmmmmmm");
    try {
        const { userId } = req.params;
        const doctorId = req.doctor;
    console.log("userId",userId);
    console.log("doctorId",doctorId);
       

        const appointment = await Appointments.findOne({ userId: userId, doctorId:doctorId })
     
    console.log("appointment",appointment);

        res.status(200).json(appointment)

    } catch (error) {
        res.status(404).json({ err: "can't access the appointment" })

    }
  },
  addPrescription:async(req,res)=>{
    console.log("addPrescriptionnnn",req.body);
    try {
        const { userId, doctorId, title, description, username, doctorname } = req.body;
        const newPrescription = new prescription({
            userId,
            doctorId,
            username,
            doctorname,
            title,
            description
        });
        newPrescription.save();
        res.status(201).json({ success: "data created successfully" })

    } catch (error) {
        res.status(500).json({ err: "data creation failure" })

    }
  },
  deletePrescription:async(req,res)=>{
    const {prescriptionId} =req.params
    console.log("presIdpresId",prescriptionId)
    if(prescriptionId)
    {
        Prescription.findByIdAndDelete(prescriptionId).then((response)=>{
            res.status(200).json("deleted successfully")
        }).catch((error)=>{
            console.log("Something error is occured")
        })
    }


  }
}