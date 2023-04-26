const express=require('express');
const {
     registerUser,
     loginUser,
     logoutUser,
     forgotPassword,
     resetPassword,
     getUserProfile,
     changePassword,
     updateProfile,
     getUser,
     getAllUsers,
     updateUser,
     deleteUser
     } = require('../controllers/authcontroller');
const router=express.Router();
const {isAuthenticationUser,authorizeRoles}=require("../middlewares/authenticate")


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/myprofile").get(isAuthenticationUser,getUserProfile);
router.route("/password/change").put(isAuthenticationUser,changePassword);
router.route("/update").put(isAuthenticationUser,updateProfile);

//Admin Routes
router.route("/admin/users").get(isAuthenticationUser, authorizeRoles('admin'),getAllUsers);
router.route("/admin/user/:id").get(isAuthenticationUser, authorizeRoles('admin'),getUser)
                                .put(isAuthenticationUser, authorizeRoles('admin'),updateUser)
                                .delete(isAuthenticationUser, authorizeRoles('admin'),deleteUser);


module.exports=router;