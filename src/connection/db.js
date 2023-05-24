const mongoose=require("mongoose");

module.exports=function connect(done)
{
    try{
        mongoose.connect('mongodb://localhost:27017/clinicManage',{ 
            useUnifiedTopology:true

        }).then((res)=>{
            done()
        })
    } catch (error){
        done(error)
    }
}