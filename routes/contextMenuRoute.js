const express=require('express');
const authController=require('../controllers/authController')
const contextMenuController=require('../controllers/contextMenuController')
const route=express.Router()

route.post('/createContextMenu/:id',authController.protect,contextMenuController.createContextMenu)
route.patch('/:id/:paramid',authController.protect,contextMenuController.updateContextMenu)
route.delete('/:id/:paramid',authController.protect,contextMenuController.deleteContextMenu)
route.get('/allContextMenu/:id',authController.protect,contextMenuController.getAll)
route.get('/:id/:paramid',authController.protect,contextMenuController.getContextMenu)







module.exports=route