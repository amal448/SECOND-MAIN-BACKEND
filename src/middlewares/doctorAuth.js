const verifyToken=require("../utils/verifyToken")
const doctor=require("../model/Doctor")
const { decode } = require("jsonwebtoken");

function doctorAuth(req,res,next)
{
    let token=req.headers.authorization.split(' ')[1];
    verifyToken(token).then(()=>{
      const {_id} = decode(token)._doc
        console.log(_id);
        doctor.findById(_id).then(result => {
            if(result) {
                req.doctor = _id;
                next()
            }else {
                res.status(400).json({block:true})
            }
        })  
        


    }).catch(()=>{
        res.status(400).json({logedIn:false})
    })
}
module.exports=doctorAuth