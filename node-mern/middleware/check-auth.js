const jwt=require('jsonwebtoken')
require('dotenv').config()

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.Authorization.split(' ')[1]
        if(!token){
            throw new Error("authentication failed")
        }
        const decodeToken=jwt.verify(token,process.env.JSON_SECRET_KEY)
        req.user=decodeToken.userId
        next()
    }catch(err){
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    }
}