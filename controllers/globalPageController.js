const Project = require("../models/projectModel");
const verif=require('./verif')

exports.createGlobalPage=async(req,res,next)=>{
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
          project.globalPages.push(data);
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

exports.updateGlobalPage = async (req, res, next) => {
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
          globalPages: { $elemMatch: { _id: req.params.paramid } },
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
          globalPages: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "globalPages.$.key": key,
            "globalPages.$.name": name,
            "globalPages.$.description": description,
            "globalPages.$.paramter": paramter&&[...paramter],
            "globalPages.$.select": select&&[...select],
            "globalPages.$.checkBox": checkBox&&[...checkBox],
            "globalPages.$.image": image,
            "globalPages.$.tag": tag,
            "globalPages.$.text": text,

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

exports.deleteGlobalPage = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.globalPages.pull({ _id: req.params.paramid });
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

exports.getGlobalPage = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var globalPage
        project.globalPages&&(globalPage=project.globalPages.find(el=>el._id.toString()===req.params.paramid))
        if(!globalPage){
            return res.status(400).json({
                status: "Fail",
                message:"Global Setting  is not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          globalPage,
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
      if(!project.globalPages.length){
        return res.status(400).json({
          status: "Fail",
          error: "This Project didn't have any Global Page",
        });
      }
   
      return res.status(200).json({
        status: "Succes",
        data: {
          globalPages:project.globalPages,
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
