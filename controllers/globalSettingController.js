const Project = require("../models/projectModel");
const verif=require('./verif')

exports.createGlobalSetting=async(req,res,next)=>{
    try {
        const { name, key, description, text,paramter,image,select,checkBox,tag} =
          req.body;
        const project = await Project.findById(req.params.id);
        if (!name||!key) {
          return res.status(400).json({
            error: {
              status: "Fail",
              message: "There is no Data 😞 ",
            },
          });
        }
        if(name===key){
          return res.status(400).json({
            error: {
              status: "Fail",
              message: "Key should be diffrent with name , Please",
            },
          }); 
        }
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
          project.globalSettings.push(data);
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

exports.updateGlobalSetting = async (req, res, next) => {
    try {
      const {  name, key, description, text,paramter,image,select,checkBox,tag } =
        req.body;
        if(name===key){
          return res.status(400).json({
            error: {
              status: "Fail",
              message: "Key should be diffrent with name , Please",
            },
          }); 
        }
        var project=await Project.findOne( {
          _id: req.params.id,
          globalSettings: { $elemMatch: { _id: req.params.paramid } },
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
          globalSettings: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "globalSettings.$.key": key,
            "globalSettings.$.name": name,
            "globalSettings.$.description": description,
            "globalSettings.$.paramter": paramter&&[...paramter],
            "globalSettings.$.select": select&&[...select],
            "globalSettings.$.checkBox": checkBox&&[...checkBox],
            "globalSettings.$.image": image,
            "globalSettings.$.tag": tag,
            "globalSettings.$.text": text,

          },
          
        },
        {new:true}
      );
   
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

exports.deleteGlobalSetting = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.globalSettings.pull({ _id: req.params.paramid });
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

exports.getGlobalSetting = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var globalSetting
        project.globalSettings&&(globalSetting=project.globalSettings.find(el=>el._id.toString()===req.params.paramid))
        if(!globalSetting){
            return res.status(400).json({
                status: "Fail",
                message:"Global Setting  is not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          globalSetting,
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
      if(!project.globalSettings.length){
        return res.status(400).json({
          status: "Fail",
          error: "This Project didn't have any Global Setting",
        });
      }
   
      return res.status(200).json({
        status: "Succes",
        data: {
          globalSettings:project.globalSettings,
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
