const express=require('express');
const authController=require('../controllers/authController')
const homePageFeedController=require('../controllers/homePageFeedController')
const route=express.Router()

route.post('/createHomePageFeed/:id',authController.protect,homePageFeedController.createHomePageFeed)
route.patch('/:id/:paramid',authController.protect,homePageFeedController.updateHomePageFeed)
route.delete('/:id/:paramid',authController.protect,homePageFeedController.deleteHomePageFeed)
route.get('/allHomePageFeeds/:id',authController.protect,homePageFeedController.getAll)
route.get('/:id/:paramid',authController.protect,homePageFeedController.getHomePageFeed)







module.exports=route