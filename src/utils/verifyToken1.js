const {verify,decode}=require('jsonwebtoken')
const Doctors = require("../model/Doctor");

module.exports=function verifyToken1(token) {
    return new Promise ((resolve,reject)=>{
        verify(token,process.env.KEY,async function(err,data,decoded)
        {
            console.log("data in verify ", data)
            if(err)
            {
                reject(err)
            }
            else{

                try{
                    const user = await Doctors.findById(data._doc._id)
                    console.log("user in verify here",user);
                    // resolve(user,decoded.response)
                    resolve(user)

                   }
                   catch(error)
                   {
                    reject(error)
                   }
               
                


            }
        })
    })
}