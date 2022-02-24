const User = require("../models/userModel");
const Project=require('../models/projectModel')
const Macro=require('../models/macroModel')
const jwt = require("jsonwebtoken");
const multer=require('multer');

const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./views/add-on-front/src/img/users');
    },
    filename:(req,file,cb)=>{
      const ext=file.mimetype.split('/')[1];
      cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
  
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
  exports.uploadUserPhoto=upload.single('photo');

const filterObj = (obj, ...params) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (params.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.viewMe = async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id).populate({path:"projects",populate:{path:"macros"}})
    
    if (!me) {
      return res.status(404).json({
        error: {
          status: "Fail",
          message: "You are not in the list of users ",
        },
      });
    }
    return res.status(200).json({
      status: "Succes",
      data: {
        me
        // macros:arr.projects[0].macros[0].name
     // currentUser: req.user,
      },
    });
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
exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.confirmPassword) {
      return res.status(400).json({
        error:{
          stauts: "Fail",
        message:
          "This route is not specified for password update please check /updatePassword",
        }
      });
    }
    const filteredBody = filterObj(req.body, "userName", "email");
    if(req.file)filteredBody.photo=req.file.filename
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "Succes",
      data: {
        user: updateUser,
        currentUser: req.user,
      },
    });
  } catch (error) {
    res.status(400).json({
      error:{
        stauts: "Fail",
      message: error.message,
      }
    });
  }
  next();
};
exports.updateMyPassword = async (req, res, next) => {
  try {
    const { passwordCurrent, password, confirmPassword } = req.body;
    //1) Get user from collection
    // houni najamna na3mlou req.user.id khater deja amlin login ya3ni kbalha bech ysir el middleware protect
    if (!passwordCurrent || !password || !confirmPassword) {
      return res.status(404).json({
        
          status: "Fail",
          message:
            "Please provide the current password , password and confirm it 😏",
      
      });
    }
    const user = await User.findById(req.user.id).select("+password");

    //2) check if POsted password is correct
    if (
      !(await user.passwordCorrect(req.body.passwordCurrent, user.password))
    ) {
      return res.status(404).json({
        
          status: "Fail",
          message: "Password is incorrect",
      
      });
    }

    //3) if so,update password
    (user.password = req.body.password),
    (user.confirmPassword = req.body.confirmPassword),
    await user.save();

    return res.status(200).json({
      status: "succes",
      data: {
        message: "Password modifed correctly ,Please Log in again now",
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  next();
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({_id:{$ne:req.user.id}});
    

    if (!users) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "There is no users",
        },
      });
    }
    // to get all user sauf the current User
    // users = users.filter((el) => el._id != req.user.id);
     res.status(200).json({
      status: "Succes",
      data: {
        results:users.length,
        users,
        currentUser:req.user
      },
    });
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
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "There is no user ",
        },
      });
    }
    res.status(200).json({
      status: "Succes",
      data: {
        user,
        currentUser: req.user,
      },
    });
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
exports.updateUser = async (req, res, next) => {
  try {
    if (req.body.password || req.body.confirmPassword) {
      return res.status(400).json({
        stauts: "Fail",
        message:
          "This route is not specified for password update please check /updatePassword",
      });
    }
    const filteredBody = filterObj(
      req.body,
      "userName",
      "email",
      "role",
      "enable"
    );
    if(req.file)filteredBody.photo=req.file.filename
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "Succes",
      data: {
        user: updateUser,
        currentUser: req.user,
      },
    });
  } catch (error) {
    res.status(400).json({
      stauts: "Fail",
      message: error.message,
    });
  }
  next();
};
exports.deleteUser = async (req, res, next) => {
   try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if(!deletedUser){
      return res.status(400).json({
        error:{
          status:'Fail',
          message:"User not exist !"
        }
      })
    }
    if(deletedUser.projects){
      deletedUser.projects.map(async el=>{const proj= await Project.findByIdAndDelete(el._id.toString());
      if(proj.macros){
        proj.macros.map(async m=>await Macro.findByIdAndDelete(m._id.toString()))
      }})
    }
    res.status(200).json({
      status: "Succes",
      data: {
        deletedUser,
        currentUser: req.user,
      },
    });
  } catch (error) {
    res.status(400).json({
      stauts: "Fail",
      message: error.message,
    });
  }
  next();
};
