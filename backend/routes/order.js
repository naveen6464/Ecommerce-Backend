const express=require("express")
const { newOrder, getSingleOrder, myOrder, orders, updateOrder, deleteOrders } = require("../controllers/orderController")
const {isAuthenticationUser,authorizeRoles}=require("../middlewares/authenticate")

const router=express.Router()

router.route('/order/new').post(isAuthenticationUser,newOrder)
router.route('/order/:id').get(isAuthenticationUser,getSingleOrder)
router.route('/myorder').get(isAuthenticationUser,myOrder);


//Admin Routes
router.route('/orders').get(isAuthenticationUser,authorizeRoles('admin'),orders);
router.route('/order/:id').put(isAuthenticationUser,authorizeRoles('admin'),updateOrder)
                          .delete(isAuthenticationUser,authorizeRoles('admin'),deleteOrders);

module.exports=router;