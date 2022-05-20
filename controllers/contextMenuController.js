const Project = require("../models/projectModel");
const verif=require('./verif')

exports.createContextMenu=async(req,res,next)=>{
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
          project.contextMenu.push(data);
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

exports.updateContextMenu = async (req, res, next) => {
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
          contextMenu: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "contextMenu.$.key": key,
            "contextMenu.$.name": name,
            "contextMenu.$.description": description,
            "contextMenu.$.paramter": paramter&&[...paramter],
            "contextMenu.$.select": select&&[...select],
            "contextMenu.$.checkBox": checkBox&&[...checkBox],
            "contextMenu.$.image": image,
            "contextMenu.$.tag": tag,
            "contextMenu.$.text": text,

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

exports.deleteContextMenu = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.contextMenu.pull({ _id: req.params.paramid });
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

exports.getContextMenu = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var contextMenu
        project.contextMenu&&(contextMenu=project.contextMenu.find(el=>el._id.toString()===req.params.paramid))
        if(!contextMenu){
            return res.status(400).json({
                status: "Fail",
                message:"Global Setting  is not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          contextMenu,
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
      if(!project.contextMenu.length){
        return res.status(400).json({
          status: "Fail",
          error: "This Project didn't have any Context Menu",
        });
      }
   
      return res.status(200).json({
        status: "Succes",
        data: {
          contextMenu:project.contextMenu,
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
