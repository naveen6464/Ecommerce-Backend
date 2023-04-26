const express=require('express');
const { getProducts, newProduct, getSingleProduct, createReview, getReviews, deleteReviews } = require('../controllers/productController');
const { updateProduct } = require('../controllers/productController');
const { deleteProduct } = require('../controllers/productController');

const {isAuthenticationUser, authorizeRoles}=require("../middlewares/authenticate")
const router=express.Router();

router.route('/products').get(isAuthenticationUser,getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/product/:id').put(updateProduct);
router.route('/product/:id').delete(deleteProduct);
router.route('/review').put(isAuthenticationUser,createReview)
                        .delete(deleteReviews)
router.route('/reviews').get(getReviews);

//
//Admin Routes
router.route('admin/product/new').post(isAuthenticationUser, authorizeRoles('admin'),newProduct);
module.exports=router;