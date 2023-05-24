const verifyToken=require("../utils/verifyToken")

function userAuth(req,res,next) 
{
    let token=req.headers.authorization.split(' ')[1];
    verifyToken(token).then(()=>{
        next()

    }).catch(()=>{
        res.status(400).json({logedIn:false})
    })
}
module.exports=userAuth