module.exports = (err, req, res, next) =>{
    err.statusCode  = err.statusCode || 500;

    if(process.env.NODE_ENV =='development'){
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack:err.stack,
            error: err,
        })
    }

    if(process.env.NODE_ENV =='production'){
        let message=err.message;
        let error= new Error (message);

        if(err.name=="validationError"){
            message= Object.values(err.errors).map(value=>value.message)
            error=new Error(message)
            err.statusCode=400    //set the status code
        }

        if(err.name == 'CastError'){
            message= `Resouser not found: ${err.path}` ;
            error=new Error(message)
            err.statusCode=400    //set the status code
        }

        
        if(err.code == 11000){
           let  message=`Dupilcate ${Object.keys(err.keyValue)} error`;
           error=new Error(message)
           err.statusCode=400    //set the status code

        }

        if(err.name=='JSONWebTokenError'){
            let message=`JSON WEB Token is invalid.Try again`
            error=new Error(message)
            err.statusCode=400    //set the status code
        }

        if(err.name=='TokenExpiredError'){
            let message=`JSON WEB Token is Expired.Try again`
            error=new Error(message)
            err.statusCode=400    //set the status code
        }
        res.status(err.statusCode).json({
            success: false,
            message: error.message || "internalserver error"
        })
    }

}