
const Product=require("../models/productModel")
 const ErrorHandler=require("../utils/errorHandler")
 const catchAsyncError=require("../middlewares/catchAsyncError")
 const APIFeatures=require("../utils/apiFeatures")

exports.getProducts= catchAsyncError(async(req,res,next)=>{
  const resPerPage=2
  const apiFeatures= new APIFeatures(Product.find(),req.query).search().filter().paginate(2);

  const products= await apiFeatures.query;
 
    res.status(200).json({
        sucess:true,
        count: products.length,
        products
    })
})

//create Product-   /api/v1/product/new
exports.newProduct= catchAsyncError (async (req,res,next)=>{
  req.body.user=req.user.id
  const product= await Product.create(req.body);
  res.status(201).json({
    sucess:true,
    product
  })
});

//get single product- }/api/v1/product/:id
exports.getSingleProduct= async(req,res,next)=>{
  const product= await Product.findById(req.params.id);
  if(!product){
      return next(new ErrorHandler('Product not found ',400)); 
  }
  res.status(201).json({
    sucess:true,
    product
  })
}

//Update Product -/api/v1/product/:id
exports.updateProduct=async(req,res,next)=>{
  let product= await Product.findById(req.params.id)
  if(!product){
    return res.status(404).json({
      sucess:false,
      message:"Product not found"
    })
  }
 product=await Product.findByIdAndUpdate(req.params.id,req.body,{
   new:true,
   runValidators:true
  })

  res.status(200).json({
    success:true,
    product
  })
}

//Delete product-/api/v1/product/:id
exports.deleteProduct=async(req,res,next)=>{
  const product= await Product.findById(req.params.id);
  if(!product){
    return res.status(404).json({
      sucess:false,
      message:"Product not found"
    })
  }
  await product.deleteOne();
  res.status(200).json({
    success:true,
    message:"product Deleted"
  })

}

//Create Review -api/v1/review

exports.createReview=catchAsyncError (async (req,res,next)=>{

  const {productId,rating,comment}=req.body;

  const review={
    user:req.user.id,
    rating,
    comment
  }

  const product= await Product.findById(productId)
  //finding user review exists
const isReviewed= product.reviews.find(review=>{
 return review.user.toString()==req.user.id.toString
 })

 if(isReviewed){
  //updateing the reviews
  product.reviews.forEach(review=>{
    if(review.user.toString()==req.user.id.toString()){
      review.comment=comment
      review.rating=rating
    }
  })

 }else{
  //createing the review
  product.reviews.push(review);
    product.numOfReviews=product.reviews.length
 }
//find the averge of the product reviews
 product.ratings=product.reviews.reduce((acc,review)=>{
  return review.rating+acc;
 },0)/product.reviews.length;
 product.ratings=isNaN(product.ratings)?0:product.ratings;

 await product.save({validateBeforeSave:false})

 res.status(200).json({
  success:true
 })
})

//Get Reviews - api/v1/reviews
exports.getReviews=catchAsyncError (async (req,res,next)=>{
  const product= await Product.findById(req.query.id);
  res.status(200).json({
    sucess:true,
    reviews:product.reviews
  })
})

//Delete Review - api/v1/review?id={review object id}&productId={product object id}
exports.deleteReviews=catchAsyncError (async (req,res,next)=>{
  const product= await Product.findById(req.query.productId);
  //filtering the reviews which does  match the daleting review id
  const reviews=product.reviews.filter(review=>{
   return review._id.toString()!==req.query.id.toString()
  })
//number of reviews
  const numOfReviews =reviews.length;
  //finding the average  the filter the reviews
  let ratings=product.reviews.reduce((acc,review)=>{
    return review.rating+acc;
   },0)/reviews.length;
   ratings=isNaN(ratings)?0:ratings;

   //saving the product document
   await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    numOfReviews,
    ratings
   })
  res.status(200).json({
    sucess:true,
    reviews:product.reviews
  })
})