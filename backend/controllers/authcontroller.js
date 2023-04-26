const catchAsyncError = require("../middlewares/catchAsyncError");
const User=require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto=require("crypto")


//Reguster User-/api/v1/register
exports.registerUser= catchAsyncError( async (req,res,next)=>{
    const{name,email,password,avatar}=req.body
  const user= await User.create({
        name,
        email,
        password,
        avatar
    })
   /*const token= user.getJwtToken();

 res.status(201).json({
    success:true,
    user,
    token
 })*/
 sendToken(user,201,res)

})


//login user-/api/v1/login
exports.loginUser=catchAsyncError( async (req,res,next)=>{
   const {email,password}=req.body

   if(!email || !password){
      return next(new ErrorHandler('please enter the email&  password',400))
   }
   //finding the user database
 const user=await  User.findOne({email}).select("+password");
 if(!user){
   return next(new ErrorHandler("Invaid email or password",401))
 }
 if(!await user.isValidPassword(password)){
   return next(new ErrorHandler("Invaid email or password",401)) 
 }
 sendToken(user,201,res)

})
//logout-api/v1/logout
exports.logoutUser=(req,res,next)=>{
  res.cookie('token',null,{
    expires:new Date(Date.now()),
    httpOnly:true
  }).status(200)
  .json({
    succuss:true,
    message:"Loggged Out"
  })
}
//forgotPassword-/api/v1/password/forgot
exports.forgotPassword=catchAsyncError(async(req,res,next)=>{
 const user= await User.findOne({email:req.body.email})
 if(!user){
  return next(new ErrorHandler("User Not fonud tis email",404))
 }

 const resetToken= user.getRestToken();
 
  await user.save({validateBeforeSave:false})
 //Cretae restet url
 const reseturl=`${req.protocol}:${req.get('host')}/api/v1/password/reset/${resetToken}`

 const message=`Your  Pasword reset Url is as follows \n\n
 ${reseturl}\n\n If you have not request this email,then ignore it. `

 try{
  sendEmail({
     email: user.email,
     subject:"NAVIShop Password Recovery",
     message
  })
  res.status(200).json({
    succuss:true,
    message:`Email send to ${user.email}`
  })

 }catch(error){
  user.resetPasswordToken=undefined;
  user.resetPasswordTokenExpire=undefined;
   await user.save({validateBeforeSave:false})
  return next(new ErrorHandler(error.message),500)
 }

})
//reset Password -/api/v1/password/reset/:token
exports.resetPassword=catchAsyncError( async(req,res,next)=>{
const resetPasswordToken= crypto.createHash('sha256').update(req.params.token).digest('hex');

const user=await User.findOne({
  resetPasswordToken,
  resetPasswordTokenExpire:{
    $gt:Date.now()
  }
})

if(!user){
  return next(new ErrorHandler("password reset token is invalid or expired"))
}
if(req.body.password !== req.body.confirmPassword){
  return next(new ErrorHandler("password doesn't match"))
}
 user.password= req.body.password;
 user.resetPasswordToken=undefined;
 user.resetPasswordTokenExpire=undefined;
  await user.save({validateBeforeSave:false});
  sendToken(user,201,res)
})

//get User Profile-/api/v1/myprofile

exports.getUserProfile= catchAsyncError(async (req,res,next) => {
  const user= await User.findById(req.user.id)
   res.status(200).json({
    succees: true,
    user
   })
})

//Change password-/api/v1/password/change
exports.changePassword=catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select('+password');

  //check old password
   if(!await user.isValidPassword(req.body.oldpassword)){
    return next(new ErrorHandler("old password  is incorrect",401))
   }

   //assign new password
   user.password=req.body.password
  await user.save();
  res.status(200).json({
    succees: true
   })
})

//updateProflie
exports.updateProfile=catchAsyncError(async(req,res,next)=>{
  const newUserData={
    name:req.body.name,
    email:req.body.email
  }
  const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,

  })
  res.status(200).json({
    succees:true,
    user
  })
})
//Admin :Get All user-/api/v1/admin/users

exports.getAllUsers= catchAsyncError(async (req,res,next)=>{

  const users= await User.find()
  res.status(200).json({
    succees:true,
    users
  })

})


//Admin :Get Specfic user-/api/v1/admin/user/:id

exports.getUser= catchAsyncError(async (req,res,next)=>{
  const user= await User.findById(req.params.id)
  if(!user){
    return next(new ErrorHandler(`User not found  with this id ${req.params.id}`))
  }
  res.status(200).json({
    succees:true,
    user
  })

})

//Admin:update User-/api/v1/admin/user/:id
exports.updateUser= catchAsyncError(async (req,res,next)=>{

  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
  const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,

  })
  res.status(200).json({
    succees:true,
    user
  })
})

//Admin :Delete User-/api/v1/admin/user/:id
exports.deleteUser= catchAsyncError(async (req,res,next)=>{
  const user=User.findById(req.user.id)
  if(!user){
    return next(new ErrorHandler(`User not found  with this id ${req.params.id}`))
  }
  await User.remove();

  res.status(200).json({
    success:true
  })

})

