const Project = require("../models/projectModel");
const verif=require('./verif')


exports.createSpaceSettings=async(req,res,next)=>{
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
          project.spaceSettings.push(data);
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

exports.updateSpaceSettings = async (req, res, next) => {
    try {
      const {  name, key, description, text,paramter,image,select,checkBox,tag } =
        req.body;
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
          spaceSettings: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "spaceSettings.$.key": key,
            "spaceSettings.$.name": name,
            "spaceSettings.$.description": description,
            "spaceSettings.$.paramter": paramter&&[...paramter],
            "spaceSettings.$.select": select&&[...select],
            "spaceSettings.$.checkBox": checkBox&&[...checkBox],
            "spaceSettings.$.image": image,
            "spaceSettings.$.tag": tag,
            "spaceSettings.$.text": text,

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

exports.deleteSpaceSettings = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.spaceSettings.pull({ _id: req.params.paramid });
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

exports.getSpaceSettings = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var spaceSetting
        project.spaceSettings&&(spaceSetting=project.spaceSettings.find(el=>el._id.toString()===req.params.paramid))
        if(!spaceSetting){
            return res.status(400).json({
                status: "Fail",
                message:"Space Setting not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          spaceSetting,
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
      const spaceSettings = await Project.findById(req.params.id);
   
      return res.status(200).json({
        status: "Succes",
        data: {
          spaceSettings:spaceSettings.spaceSettings,
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
