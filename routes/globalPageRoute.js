const express=require('express');
const authController=require('../controllers/authController')
const globalPageController=require('../controllers/globalPageController')
const route=express.Router()

route.post('/createGlobalPage/:id',authController.protect,globalPageController.createGlobalPage)
route.patch('/:id/:paramid',authController.protect,globalPageController.updateGlobalPage)
route.delete('/:id/:paramid',authController.protect,globalPageController.deleteGlobalPage)
route.get('/allGlobalPages/:id',authController.protect,globalPageController.getAll)
route.get('/:id/:paramid',authController.protect,globalPageController.getGlobalPage)







module.exports=route