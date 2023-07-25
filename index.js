const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const morgan = require('morgan');

const socket = require("socket.io");
require("dotenv")

const connect=require("./src/connection/db")

//routes imports

const userRoutes=require("./src/routes/userRoutes")
const adminRoutes=require("./src/routes/adminRoutes")
const doctorRoutes=require("./src/routes/doctorRoute")
const conversation=require("./src/routes/conversation")
const message=require("./src/routes/messages")
const app=express()
app.use(morgan('common'))

app.use(cors({
    origin:["http://localhost:5173","https://celadon-blancmange-e713f5.netlify.app"],
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

// const PORT = process.env.PORT || 5000
// app.listen(PORT,()=>console.log("server started ",PORT))


const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Listening on socket  port ${port}...`);
});

const io = socket(server,{
    cors:{
      origin:["http://localhost:5173"],

    }
})



let users=[];

const addUser=(userId,socketId)=>{
    !users.some(user=>user.userId ===userId) &&
    users.push({userId,socketId})
}

io.on("connection",(socket)=>{
    console.log("a user connected.")
    // io.emit("welcome","hello this is socket server !")
    socket.on("addUser",(userId)=>{
        console.log("socket.id,",socket.id)
        addUser(userId,socket.id)
        io.emit("getUsers",users)
    }) 

        //sender
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        console.log("senderId",senderId)
        console.log("receiverId",receiverId)
        console.log("text",text)

        const user=getUser(receiverId)

        if (user && user.socketId) {

        io.to(user.socketId).emit("getMessage",{
            senderId,
            text,
    
        })
    }
    })
//    disconnect 
    socket.on("disconnect", ()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
    })
})

const getUser =(userId)=>{
    console.log("userId",userId)
    return users.find((user) =>user.userId ===userId) 
}




const removeUser=(socketId)=>{
    users=users.filter((user)=>user.socketId !==socketId)
}



