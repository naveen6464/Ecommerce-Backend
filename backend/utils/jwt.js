const sendToken=(user,statusCode,res)=>{
    //creating jwt Token
    const token=user.getJwtToken();

    //setiing cookies
    const options={
        expires: new Date(
            Date.now()+ process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
            ),
    
    httpOnly:true,
}

    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        sussess:true,
        token,
        user
    })
}
module.exports=sendToken;