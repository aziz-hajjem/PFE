const express=require('express');
const authController=require('../controllers/authController')
const globalSettingController=require('../controllers/globalSettingController')
const route=express.Router()

route.post('/createGlobalSetting/:id',authController.protect,globalSettingController.createGlobalSetting)
route.patch('/:id/:paramid',authController.protect,globalSettingController.updateGlobalSetting)
route.delete('/:id/:paramid',authController.protect,globalSettingController.deleteGlobalSetting)
route.get('/allGlobalSettings/:id',authController.protect,globalSettingController.getAll)
route.get('/:id/:paramid',authController.protect,globalSettingController.getGlobalSetting)







module.exports=route