const mongoose=require("mongoose")

const orderSchema=mongoose.Schema({
    shippingInfo:{
      address:{
        type:String,
        required:true
      },  
      country:{
        type:String,
        required:true
      },  
       city:{
        type:String,
        required:true
      }, 
      phoneNo:{
        type:String,
        required:true
      },  
      postalCode:{
        type:String,
        required:true
      },   
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'User'
    },
    orderItems:[{
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
       
        image:{
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.SchemaTypes.ObjectId,
            required:true,
            ref:'Product'
        }
    }],
    itemPrice:{
        type:Number,
        require:true,
        default:0.0
    },
    taxPrice:{
        type:Number,
        require:true,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        require:true,
        default:0.0
    },
    totalPrice:{
        type:Number,
        require:true,
        default:0.0
    },
    paidAt:{
        type:Date
    },
    deliveredAt:{
        type:Date
    },
    orderStatus:{
        type:String,
        require:true,
        default:"processing"
    },
    createAt:{
        type:Date,
        default:Date.now

    },
})


let orderMoodel=mongoose.model("Order",orderSchema)

module.exports=orderMoodel;