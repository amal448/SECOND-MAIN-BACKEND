const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
require("dotenv")

const connect=require("./src/connection/db")

//routes imports

const userRoutes=require("./src/routes/userRoutes")
const adminRoutes=require("./src/routes/adminRoutes")
const doctorRoutes=require("./src/routes/doctorRoute")
const conversation=require("./src/routes/conversation")
const message=require("./src/routes/messages")
const app=express()

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true
}))

app.use(bodyParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set(connect((err)=>{
    if(err){
        console.log(err.message);
        return;
    }
    console.log("db connected")
}))

//setup routes
app.use('/api/user',userRoutes)
app.use('/api/doctor',doctorRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/conversations',conversation)
app.use('/api/messages',message)

// error handler

app.use("*",(err,req,res,next)=>{
    console.error(err.stack)
    next(err)
})

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log("server started ",PORT))