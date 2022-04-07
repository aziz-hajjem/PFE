const express=require('express');
const authController=require('../controllers/authController')
const spacePageController=require('../controllers/spacePageController')
const route=express.Router()

route.post('/createSpacePage/:id',authController.protect,spacePageController.createSpacePages)
route.patch('/:id/:paramid',authController.protect,spacePageController.updateSpacePages)
route.delete('/:id/:paramid',authController.protect,spacePageController.deleteSpacePage)
route.get('/allSpacePages/:id',authController.protect,spacePageController.getAll)
route.get('/:id/:paramid',authController.protect,spacePageController.getSpacePage)







module.exports=route