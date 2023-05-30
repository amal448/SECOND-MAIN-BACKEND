const { decode } = require("jsonwebtoken");
const verifyToken=require("../utils/verifyToken");
const Users = require("../model/User");

function userAuth(req,res,next) 
{
    let token=req.headers.authorization.split(' ')[1];
    verifyToken(token).then(()=>{
        const {_id} = decode(token)._doc
        console.log(_id);
        Users.findById(_id).then(result => {
            if(result.active) {
                next()
            }else {
                res.status(400).json({active:false})
            }
        })
    }).catch(()=>{
        res.status(400).json({logedIn:false})
    })
}
module.exports=userAuth