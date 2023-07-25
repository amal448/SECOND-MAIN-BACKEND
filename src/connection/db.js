const mongoose=require("mongoose");

module.exports=function connect(done)
{
    // mongodb://localhost:27017/clinicManage
    try{
        mongoose.connect(process.env.MONGODB_URI,{ 
            useUnifiedTopology:true

        }).then((res)=>{
            done()
        })
    } catch (error){
        done(error)
    }
}