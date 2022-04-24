const express=require('express');
const authController=require('../controllers/authController')
const macroController=require('../controllers/macroController')
const route=express.Router()

route.post('/createMacro/:id',authController.protect,macroController.createMacro)
route.patch('/:id/:paramid',authController.protect,macroController.updateMacro)
route.delete('/:id/:paramid',authController.protect,macroController.deleteMacro)
route.get('/allMacros/:id',authController.protect,macroController.getAll)
route.get('/:id/:paramid',authController.protect,macroController.getMacro)



module.exports=route