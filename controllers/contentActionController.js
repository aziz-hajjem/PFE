const Project = require("../models/projectModel");
const verif=require('./verif')

exports.createContentAction=async(req,res,next)=>{
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
          project.contentActions.push(data);
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

exports.updateContentAction = async (req, res, next) => {
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
          contentActions: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "contentActions.$.key": key,
            "contentActions.$.name": name,
            "contentActions.$.description": description,
            "contentActions.$.paramter": paramter&&[...paramter],
            "contentActions.$.select": select&&[...select],
            "contentActions.$.checkBox": checkBox&&[...checkBox],
            "contentActions.$.image": image,
            "contentActions.$.tag": tag,
            "contentActions.$.text": text,

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

exports.deleteContentAction = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.contentActions.pull({ _id: req.params.paramid });
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

exports.getContentAction = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var contentAction
        project.contentActions&&(contentAction=project.contentActions.find(el=>el._id.toString()===req.params.paramid))
        if(!contentAction){
            return res.status(400).json({
                status: "Fail",
                message:"content action  is not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          contentAction,
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
      if(!project.contentActions.length){
        return res.status(400).json({
          status: "Fail",
          error: "This Project didn't have any Content Action",
        });
      }
   
      return res.status(200).json({
        status: "Succes",
        data: {
          contentActions:project.contentActions,
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
