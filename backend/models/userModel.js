const mongoose=require("mongoose");
const validator= require("validator");
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken");
const crypto=require("crypto")

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please eneter name'],
    },
    email:{
        type:String,
        required:[true,'please eneter email'],
        unique: true,
        validate:[validator.isEmail,'plase enter valid email']
    },
    password:{
        type:String,
        required:[true,"please the password"],
        maxlength:[6,'password cannot exceed 6 charactors'],
        select:false
    },
    avatar:{
        type:String,
        required:true
    },
    role  :{
        type:String,
        default:'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    
    createAt:{
        type:Date,
        default:Date.now
    }

})

userSchema.pre("save",async function(next){
    //console.log('insav',this.password)
    if(!this.isModified('password')){
        next();
    }
    this.password= await bcrypt.hash(this.password,10)
})
userSchema.methods.getJwtToken=function(){
   return  jwt.sign({id: this.id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_TIME
  })
}

userSchema.methods.isValidPassword=async function(enteredPassword){
  return   bcrypt.compare(enteredPassword,this.password)
   
}

userSchema.methods.getRestToken=function(){
    //generate token 
   const token= crypto.randomBytes(20).toString("hex");
   //generate hash and set to restpasswoerd token
  this.resetPasswordToken= crypto.createHash('sha256').update(token).digest('hex')

  //set token exprine time
  this.resetPasswordTokenExpire=Date.now()+30 * 60 * 1000
  return token
}

let model= mongoose.model("User",userSchema);   

module.exports=model