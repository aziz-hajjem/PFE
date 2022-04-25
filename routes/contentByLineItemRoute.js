const express=require('express');
const authController=require('../controllers/authController')
const contentByLineItemController=require('../controllers/contentByLineItemController')
const route=express.Router()

route.post('/createContentByLineItem/:id',authController.protect,contentByLineItemController.createContentByLineItem)
route.patch('/:id/:paramid',authController.protect,contentByLineItemController.updateContentByLineItem)
route.delete('/:id/:paramid',authController.protect,contentByLineItemController.deleteContentByLineItem)
route.get('/allContentByLineItems/:id',authController.protect,contentByLineItemController.getAll)
route.get('/:id/:paramid',authController.protect,contentByLineItemController.getContentByLineItem)

module.exports=route