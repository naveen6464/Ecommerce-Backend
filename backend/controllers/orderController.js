const catchAsyncError = require("../middlewares/catchAsyncError");
const Order=require("../models/orderModel");
const Product=require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
//Create New Order -/api/v1/order/new
exports.newOrder=catchAsyncError(async(req,res,next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    }=req.body;
   const order= await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
     paidAt:Date.now(),
     user:req.user.id
    })
    res.status(200).json({
      sucess:true,
      order
    })
})


//Get Single order -api/v1/order/:id
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order= await Order.findById(req.params.id).populate('user','name email')
    if(!order){
       return next(new ErrorHandler(`Order not fonud with id:${req.params.id}`,404))
    }
    res.status(200).json({
        sucess:true,
        order
    })
})

//get user logged orders -api/v1/myorders
exports.myOrder =catchAsyncError(async(req,res,next)=>{
    const order= await Order.find({user:req.user.id})
    res.status(200).json({
        sucess:true,
        order
    })
})
//Admin: Get  All  Orders- api/v1/orders
exports.orders=catchAsyncError(async(req,res,next)=>{
    const orders= await Order.find()

    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        sucess:true,
        totalAmount,
        orders
    })
})

//Update Orders /Order Status -api/v1/order/:id
exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    const order= await Order.findById(req.params.id)  
    if(order.orderStatus =='Delivered')
   {
    return next(new ErrorHandler('Oreder alreadey Delivered',400))
   }
// Updataing the product stock of each order Item
   order.orderItems.forEach( async orderItem=>{
    await updateStock(orderItem.product,orderItem.quantity)
   })
   order.orderStatus=req.body.orderStatus;
   order.deliveredAt=Date.now();
   await order.save();
   res.status(200).json({
    success:true
   })

})

async function updateStock(productId,quantity){
    const product=await Product.findById(productId);
    product.stock=product.stock - quantity;
    product.save({validateBeforeSave:false})
}


//Admin: Delete order - api/v1/order/:id

exports.deleteOrders=catchAsyncError(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`Order not fonud with id:${req.params.id}`,404))
     }
     await order.remove();
     res.status(200).json({
        success:true
     })

})