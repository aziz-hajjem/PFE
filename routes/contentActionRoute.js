const express=require('express');
const authController=require('../controllers/authController')
const contentActionController=require('../controllers/contentActionController')
const route=express.Router()

route.post('/createContentAction/:id',authController.protect,contentActionController.createContentAction)
route.patch('/:id/:paramid',authController.protect,contentActionController.updateContentAction)
route.delete('/:id/:paramid',authController.protect,contentActionController.deleteContentAction)
route.get('/allContentActions/:id',authController.protect,contentActionController.getAll)
route.get('/:id/:paramid',authController.protect,contentActionController.getContentAction)







module.exports=route