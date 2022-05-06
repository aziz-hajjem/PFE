const Project = require("../models/projectModel");
const verif=require('./verif')


exports.createMacro=async(req,res,next)=>{
  try {
      const { name, key, description, text,paramter,image,select,checkBox,tag} =
        req.body;
      const project = await Project.findById(req.params.id);

    const data={name,key,description};
      paramter&&(data.paramter=[...paramter]);
      select&&(data.select=[...select]);
      checkBox&&(data.checkBox=[...checkBox]);
      text&&(data.text=text);
      tag&&(data.tag=tag);
      image&&(data.image=image);


      if(verif(project,data))
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Key or Name is already Used",
        },
      });
      if (data)
        project.macros.push(data);
  

      await project.save();
      return res.status(200).json({
        status: "Succes",
        data: {
          project,
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



exports.updateMacro = async (req, res, next) => {
  try {
    const {  name, key, description, text,paramter,image,select,checkBox,tag } =
        req.body;
    
    // if (req.file) filteredBody.icon = req.file.filename;
    if (!req.body) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "There is no data for update",
        },
      });
    }
    var project=await Project.findOne( {
      _id: req.params.id,
      macros: { $elemMatch: { _id: req.params.paramid } },
    }, )
    const data={name,key}
    if(verif(project,data))
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Key or Name is already Used",
        },
      });
     project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        macros: { $elemMatch: { _id: req.params.paramid } },
      }, 
      {
        $set: {
          "macros.$.key": key,
          "macros.$.name": name,
          "macros.$.description": description,
          "macros.$.paramter": paramter&&[...paramter],
          "macros.$.select": select&&[...select],
          "macros.$.checkBox": checkBox&&[...checkBox],
          "macros.$.image": image,
          "macros.$.tag": tag,
          "macros.$.text": text,

        },
        
      },
      {new:true,runValidators:true}
    );
    
    if (!project) {
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
exports.deleteMacro = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    project.macros.pull({ _id: req.params.paramid });
    await project.save();
    return res.status(200).json({
      status: "Succes",
      data: {
        project,
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

exports.getAll = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if(!project.macros.length){
      return res.status(400).json({
        status: "Fail",
        error: "This Project didn't have any Macro",
      });
    }
 
    return res.status(200).json({
      status: "Succes",
      data: {
        macros:project.macros,
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
    const project = await Project.findById(req.params.id);
    var macro
      project.macros&&(macro=project.macros.find(el=>el._id.toString()===req.params.paramid))
      if(!macro){
          return res.status(400).json({
              status: "Fail",
              message:"Macro  is not found !"
            });
      }
    return res.status(200).json({
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
// exports.addCategories = async (req, res, next) => {
//   try {
//     const { categorie } = req.body;
//     const macro = await Macro.findById(req.params.id);
//     if (categorie) macro.categories.push(categorie);
//     await macro.save();
//     res.status(200).json({
//       status: "Succes",
//       data: {
//         message: "Categorie is added succesfully",
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: {
//         status: "Fail",
//         message: error.message,
//       },
//     });
//   }
//   next();
// };
// exports.addParamter = async (req, res, next) => {
//   try {
//     const { identifier, paramterName, paramterDescription, type, required, multiple } =
//       req.body;
//     const macro = await Macro.findById(req.params.id);
//     if (req.body)
//       macro.parameters.push({
//         identifier,
//         paramterName,
//         paramterDescription,
//         type,
//         required,
//         multiple,
//       });
//     await macro.save();
//     res.status(200).json({
//       status: "Succes",
//       data: {
//         macro,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: {
//         status: "Fail",
//         message: error.message,
//       },
//     });
//   }
//   next();
// };
// exports.deleteParamter = async (req, res, next) => {
//   try {
//     const macro = await Macro.findById(req.params.id);
//     macro.parameters.pull({ _id: req.params.paramid });
//     await macro.save();
//     res.status(200).json({
//       status: "Succes",
//       data: {
//         macro,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: {
//         status: "Fail",
//         message: error.message,
//       },
//     });
//   }
//   next();
// };
// exports.updateParamter = async (req, res, next) => {
//   try {
//     const { identifier, paramterName, paramterDescription, type, required, multiple } =
//       req.body;
//     const macro = await Macro.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         parameters: { $elemMatch: { _id: req.params.paramid } },
//       }, 
//       {
//         $set: {
//           "parameters.$.identifier": identifier,
//           "parameters.$.paramterName": paramterName,
//           "parameters.$.paramterDescription": paramterDescription,
//           "parameters.$.type": type,
//           "parameters.$.required": required,
//           "parameters.$.multiple": multiple,
//         },
        
//       },
//       {new:true}
//     );
 
//     res.status(200).json({
//       status: "Succes",
//       data: {
//         macro,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: {
//         status: "Fail",
//         message: error.message,
//       },
//     });
//   }
//   next();
// };
