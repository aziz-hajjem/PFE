const Project = require('../models/projectModel')
const User = require('../models/userModel')
const multer=require('multer');

const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./views/add-on-front/src/img/icons');
    },
    filename:(req,file,cb)=>{
      const ext=file.mimetype.split('/')[1];
      cb(null,`icon-${req.user.id}-${Date.now()}.${ext}`)
  
    }
  })
  // const multerStorage=multer.memoryStorage();
  
  // test if the upload file is an image
  const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
      cb(null,true)
    }else{
      cb(new Error('Not an image ! Please upload only images'),false)
    }
  
  }
  
  // upload image
  const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
  })
  exports.uploadProjectPhoto=upload.single('icon');



exports.createProject = async (req, res, next) => {
    try {
      const { name, key, description,icon,vendorName,vendorUrl,authentication,enableLicensing } = req.body;
      
      const newProject = await Project.create({
        name:name,
        key:key,
        description:description,
        icon:icon,
        vendor:{
            name:vendorName,
            url:vendorUrl
        },
        authentication:authentication,
        enableLicensing:enableLicensing
      });
      if(!newProject){
          return res.status(400).json({
              error:{
                  status:'Fail',
                  message:"Failed to create new project"
              }
          })
      }
      const user=await User.findById(req.user.id);
      await user.projects.push(newProject)
      await user.save()
      return res.status(201).json({
          status:"Succes",
          data:{
              newProject
          }
      })

    } catch (error) {
      
      res.status(400).json({
        error: {
          status: "Fail",
          message: error.message,
        },
      });
    }
    next();
};

const filterObj = (obj, ...params) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (params.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateProject = async (req, res, next) => {
    try {
      
      const filteredBody = filterObj(req.body, "name", "key","description","authentication","enableLicensing");
      if(req.file)filteredBody.icon=req.file.filename
      if(!req.body){
          return res.status(400).json({
              error:{
                  status:"Fail",
                  message:"There is no data for update"
              }
          })
      }
      const project = await Project.findByIdAndUpdate(req.params.id,filteredBody,{
        new: true,
        runValidators: true,
      });
      if(!project){
          return res.status(400).json({
              error:{
                  status:'Fail',
                  message:"Project is not exist !! "
              }
          })
      }

      return res.status(201).json({
          status:"Succes",
          data:{
              currentUser:req.user
          }
      })

    } catch (error) {
      
      res.status(400).json({
        error: {
          status: "Fail",
          message: error.message,
        },
      });
    }
    next();
};
exports.deleteProject = async (req, res, next) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if(!project){
          return res.status(400).json({
              error:{
                  status:'Fail',
                  message:"Project is not exist !! "
              }
          })
      }
      const user=await User.findById(req.user.id)
      user.projects.pull({_id:req.params.id})
      await user.save()

      return res.status(201).json({
          status:"Succes",
          data:{
              currentUser:req.user
          }
      })

    } catch (error) {
      
      res.status(400).json({
        error: {
          status: "Fail",
          message: error.message,
        },
      });
    }
    next();
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await User.findById(req.user.id).select('projects').populate('projects');
    if(!projects){
        return res.status(400).json({
            error:{
                status:'Fail',
                message:"This user have not projects !! "
            }
        })
    }


    return res.status(201).json({
        status:"Succes",
        data:{
          results:projects.projects.length,
          projects:projects.projects
        }
    })

  } catch (error) {
    
    res.status(400).json({
      error: {
        status: "Fail",
        message: error.message,
      },
    });
  }
  next();
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if(!project){
        return res.status(400).json({
            error:{
                status:'Fail',
                message:"Project not found !! "
            }
        })
    }


    return res.status(201).json({
        status:"Succes",
        data:{
          project
        }
    })

  } catch (error) {
    
    res.status(400).json({
      error: {
        status: "Fail",
        message: error.message,
      },
    });
  }
  next();
};