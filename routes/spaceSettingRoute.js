const express=require('express');
const authController=require('../controllers/authController')
const spaceSettingsController=require('../controllers/spaceSettingsController')
const route=express.Router()

route.post('/createSpaceSetting/:id',authController.protect,spaceSettingsController.createSpaceSettings)
route.patch('/:id/:paramid',authController.protect,spaceSettingsController.updateSpaceSettings)
route.delete('/:id/:paramid',authController.protect,spaceSettingsController.deleteSpaceSettings)
route.get('/allSpaceSettings/:id',authController.protect,spaceSettingsController.getAll)
route.get('/:id/:paramid',authController.protect,spaceSettingsController.getSpaceSettings)







module.exports=route