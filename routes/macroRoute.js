const express=require('express');
const authController=require('../controllers/authController')
const macroController=require('../controllers/macroController')
const route=express.Router()

route.post('/createMacro/:id',authController.protect,macroController.createMacro)
route.patch('/:projectid/:id',authController.protect,macroController.uploadMacroPhoto,macroController.updateMacro)
route.delete('/:projectid/:id',authController.protect,macroController.deleteMacro)
route.get('/allMacros/:id',authController.protect,macroController.getAllMacro)
route.get('/:projectid/:id',authController.protect,macroController.getMacro)
route.patch('/addCategorie/:id',authController.protect,macroController.addCategories)
route.post('/paramter/:id',authController.protect,macroController.addParamter)
route.delete('/paramter/:id/:paramid',authController.protect,macroController.deleteParamter)
route.patch('/paramter/:id/:paramid',authController.protect,macroController.updateParamter)






module.exports=route