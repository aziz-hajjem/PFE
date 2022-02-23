const express=require('express');
const authController=require('../controllers/authController')
const macroController=require('../controllers/macroController')
const route=express.Router()

route.post('/createMacro/:id',authController.protect,macroController.createMacro)
route.patch('/:id',authController.protect,macroController.uploadMacroPhoto,macroController.updateMacro)
route.delete('/:projectid/:id',authController.protect,macroController.deleteMacro)
route.get('/allMacros/:id',authController.protect,macroController.getAllMacro)
route.get('/:id',authController.protect,macroController.getMacro)
route.patch('/addCategorie/:id',authController.protect,macroController.addCategories)
route.post('/addParamter/:id',authController.protect,macroController.addParamter)
route.delete('/deleteParamter/:id/:paramid',authController.protect,macroController.deleteParamter)





module.exports=route