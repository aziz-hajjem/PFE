const express=require('express');
const authController=require('../controllers/authController')
const userController=require('../controllers/userController')
const route=express.Router()

route.get('/me',authController.protect,userController.viewMe);
route.patch('/updateme',authController.protect,userController.uploadUserPhoto,userController.updateMe);
route.patch('/updatemypassword',authController.protect,userController.updateMyPassword);
route.get('/',authController.protect,authController.restrictTo(['admin']),userController.getAllUsers);
route.get('/:id',authController.protect,authController.restrictTo(['admin']),userController.getUser);
route.patch('/:id',authController.protect,authController.restrictTo(['admin']),userController.uploadUserPhoto,userController.updateUser);
route.delete('/:id',authController.protect,authController.restrictTo(['admin']),userController.deleteUser);



module.exports=route