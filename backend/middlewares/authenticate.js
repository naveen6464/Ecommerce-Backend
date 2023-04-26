const ErrorHandler = require("../utils/errorHandler");
const User=require("../models/userModel")
const catchAsyncError = require("./catchAsyncError");
const jwt=require("jsonwebtoken")

exports.isAuthenticationUser=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        return next(new ErrorHandler('login  firest to hnadle tis resoures',401))
    }
  const decoded=  jwt.verify(token,process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id)
  next()
})


exports.authorizeRoles= (...roles)=>{
return(req,res,next)=>{
  if(!roles.includes(req.user.role)){
    return next(new ErrorHandler(`Role ${req.user.role}is not allowed`,401))
  }
  next()
}
}