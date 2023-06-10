const verifyToken1=require("../utils/verifyToken1")
const Doctors = require("../model/Doctor");




async function doctorAuth(req, res, next) {
    try {
        let token = req.headers.authorization.split(' ')[1];
        console.log("tokennnnnnnnnnnnnnnnnnnnnnns",token);
      const response = await verifyToken1(token);
  
      console.log("response", response);
  
      if (response) {
        const user = await Doctors.findById(response._id);
        console.log("doctor Id./////////", user);
        req.doctor = user?._id;
        console.log( "doctor id kittyyyyyyy",req.doctor);
        next();
      }
    } catch (error) {
      console.log("at Catcheeeeeeeeee");
      res.status(400).json({ loggedIn: false });
    }
  }
  
  module.exports = doctorAuth;






//   module.exports=function verifyToken(token) {
//     return new Promise ((resolve,reject)=>{
//         verify(token,process.env.KEY,async function(err,data,decoded)
//         {
//             console.log("data in verify ", data)
//             if(err)
//             {
//                 reject(err)
//             }
//             else{

//                 try{
//                     const user = await Doctors.findById(data._doc._id)
//                     console.log("user in verify here",user);
//                     // resolve(user,decoded.response)
//                     resolve(user)

//                    }
//                    catch(error)
//                    {
//                     reject(error)
//                    }
               
                


//             }
//         })
//     })
// }