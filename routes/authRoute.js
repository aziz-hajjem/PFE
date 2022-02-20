const express=require('express');
const route=express.Router();
const authController=require('../controllers/authController')


route.post('/signup',authController.signUp)
route.post('/login',authController.logIn)
route.post('/forgotpassword',authController.forgotPassword)
route.patch('/resetpassword/:token',authController.resetPassword)





module.exports=route;

