const Project = require("../models/projectModel");
const Macro = require("../models/macroModel");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./views/add-on-front/src/img/macros");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `Macro_icon-${req.user.id}-${Date.now()}.${ext}`);
  },
});
// const multerStorage=multer.memoryStorage();

// test if the upload file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image ! Please upload only images"), false);
  }
};

// upload image
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadMacroPhoto = upload.single("icon");

exports.createMacro = async (req, res, next) => {
  try {
    const { name, key, description, icon, categories, bodyType, outputType } =
      req.body;
    const project = await Project.findById(req.params.id).populate("macros");
    if (!project) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "There is no project to add this Macro",
        },
      });
    }

    const newMacro = await Macro.create({
      name: name,
      key: key,
      description: description,
      icon: icon,
      categories: [categories],
      bodyType: bodyType,
      outputType: outputType,
    });
    if (!newMacro) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Failed to create new macro :confounded:",
        },
      });
    }

    await project.macros.push(newMacro);
    await project.save();
    await newMacro.save()
    return res.status(201).json({
      status: "Succes",
      data: {
        newMacro,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: {
        status: "Fail",
        message: error,
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

exports.updateMacro = async (req, res, next) => {
  try {
    const filteredBody = filterObj(
      req.body,
      "name",
      "key",
      "description",
      "bodyType",
      "outputType"
    );
    const project=await Project.findById(req.params.projectid)
    const find= project.macros.find(el=>el.toString()===req.params.id)
      if(!find){
        return res.status(400).json({
          error:{
            status:"Fail",
            message:"This Macro is not yours 😠"
          }
        })
      }

    if (req.file) filteredBody.icon = req.file.filename;
    if (!req.body) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "There is no data for update",
        },
      });
    }
    const macro = await Macro.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true,
    });
    await macro.save()
    
    if (!macro) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Macro does not exist !! ",
        },
      });
    }

    return res.status(201).json({
      status: "Succes",
      data: {
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
exports.deleteMacro = async (req, res, next) => {
  try {
    const macro=await Macro.findByIdAndDelete(req.params.id);
    if(!macro){
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Macro does not exist 😠",
        },
      });
    }
    const project=await Project.findById(req.params.projectid)
    const find= project.macros.find(el=>el.toString()===req.params.id)
      if(!find){
        return res.status(400).json({
          error:{
            status:"Fail",
            message:"This Macro is not yours 😠"
          }
        })
      }

      
    project.macros.pull({ _id: req.params.id });
    await project.save();

    return res.status(201).json({
      status: "Succes",
      data: {
        project
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

exports.getAllMacro = async (req, res, next) => {
  try {
    const macros = await Project.findById(req.params.id)
      .populate("macros")
      .select("macros");
    if (!macros) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "This user have not macros !! ",
        },
      });
    }

    return res.status(201).json({
      status: "Succes",
      data: {
        macros,
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

exports.getMacro = async (req, res, next) => {
  try {
    const macro = await Macro.findById(req.params.id);

    if (!macro) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Macro not found !! ",
        },
      });
    }
    const project=await Project.findById(req.params.projectid)
    const find= project.macros.find(el=>el.toString()===req.params.id)
      if(!find){
        return res.status(400).json({
          error:{
            status:"Fail",
            message:"This Macro is not yours 😠"
          }
        })
      }
    

    return res.status(201).json({
      status: "Succes",
      data: {
        macro,
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
exports.addCategories = async (req, res, next) => {
  try {
    const { categorie } = req.body;
    const macro = await Macro.findById(req.params.id);
    if (categorie) macro.categories.push(categorie);
    await macro.save();
    res.status(200).json({
      status: "Succes",
      data: {
        message: "Categorie is added succesfully",
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
exports.addParamter = async (req, res, next) => {
  try {
    const { identifier, paramterName, paramterDescription, type, required, multiple } =
      req.body;
    const macro = await Macro.findById(req.params.id);
    if (req.body)
      macro.parameters.push({
        identifier,
        paramterName,
        paramterDescription,
        type,
        required,
        multiple,
      });
    await macro.save();
    res.status(200).json({
      status: "Succes",
      data: {
        macro,
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
exports.deleteParamter = async (req, res, next) => {
  try {
    const macro = await Macro.findById(req.params.id);
    macro.parameters.pull({ _id: req.params.paramid });
    await macro.save();
    res.status(200).json({
      status: "Succes",
      data: {
        macro,
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
exports.updateParamter = async (req, res, next) => {
  try {
    const { identifier, paramterName, paramterDescription, type, required, multiple } =
      req.body;
    const macro = await Macro.findOneAndUpdate(
      {
        _id: req.params.id,
        parameters: { $elemMatch: { _id: req.params.paramid } },
      }, 
      {
        $set: {
          "parameters.$.identifier": identifier,
          "parameters.$.paramterName": paramterName,
          "parameters.$.paramterDescription": paramterDescription,
          "parameters.$.type": type,
          "parameters.$.required": required,
          "parameters.$.multiple": multiple,
        },
        
      },
      {new:true}
    );
 
    res.status(200).json({
      status: "Succes",
      data: {
        macro,
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
