const Project = require("../models/projectModel");
const verif=require('./verif')

exports.createSpacePages=async(req,res,next)=>{
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
          project.spacePages.push(data);
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

exports.updateSpacePages = async (req, res, next) => {
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
          spacePages: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "spacePages.$.key": key,
            "spacePages.$.name": name,
            "spacePages.$.description": description,
            "spacePages.$.paramter": paramter&&[...paramter],
            "spacePages.$.select": select&&[...select],
            "spacePages.$.checkBox": checkBox&&[...checkBox],
            "spacePages.$.image": image,
            "spacePages.$.tag": tag,
            "spacePages.$.text": text,

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

exports.deleteSpacePage = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.spacePages.pull({ _id: req.params.paramid });
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

exports.getSpacePage = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var spacePage
        project.spacePages&&(spacePage=project.spacePages.find(el=>el._id.toString()===req.params.paramid))
        if(!spacePage){
            return res.status(400).json({
                status: "Fail",
                message:"Space Page is not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          spacePage,
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
      if(!project.spacePages.length){
        return res.status(400).json({
          status: "Fail",
          error: "This Project didn't have any space Page",
        });
      }
   
      return res.status(200).json({
        status: "Succes",
        data: {
          spacePages:project.spacePages,
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
