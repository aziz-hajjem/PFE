const express=require('express');
const authController=require('../controllers/authController')
const projectController=require('../controllers/projectController')
const route=express.Router()

route.post('/createProject',authController.protect,projectController.createProject)
route.patch('/:id',authController.protect,projectController.uploadProjectPhoto,projectController.updateProject)
route.delete('/:id',authController.protect,projectController.deleteProject)
route.get('/allProjects',authController.protect,projectController.getAllProjects)
route.get('/:id',authController.protect,projectController.getProject)
route.get('/:id/generate',authController.protect,projectController.generate)



module.exports=route