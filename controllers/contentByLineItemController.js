const Project = require("../models/projectModel");

exports.createContentByLineItem=async(req,res,next)=>{
    try {
        const { name, key, description,tooltip, text,paramter,image,select,checkBox,tag} =
          req.body;
        const project = await Project.findById(req.params.id);
        const data={name,key,description,tooltip};
        paramter&&(data.paramter=[...paramter]);
        select&&(data.select=[...select]);
        checkBox&&(data.checkBox=[...checkBox]);
        text&&(data.text=text);
        tag&&(data.tag=tag);
        image&&(data.image=image);
        if (data)
          project.contentByLineItems.push(data);
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

exports.updateContentByLineItem = async (req, res, next) => {
    try {
      const {  name, key, description,tooltip, text,paramter,image,select,checkBox,tag } =
        req.body;
      const project = await Project.findOneAndUpdate(
        {
          _id: req.params.id,
          globalPages: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "contentByLineItems.$.key": key,
            "contentByLineItems.$.name": name,
            "contentByLineItems.$.tooltip": tooltip,
            "contentByLineItems.$.description": description,
            "contentByLineItems.$.paramter": paramter&&[...paramter],
            "contentByLineItems.$.select": select&&[...select],
            "contentByLineItems.$.checkBox": checkBox&&[...checkBox],
            "contentByLineItems.$.image": image,
            "contentByLineItems.$.tag": tag,
            "contentByLineItems.$.text": text,

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

exports.deleteContentByLineItem = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.contentByLineItems.pull({ _id: req.params.paramid });
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

exports.getContentByLineItem = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var contentByLineItem
        project.contentByLineItems&&(contentByLineItem=project.contentByLineItems.find(el=>el._id.toString()===req.params.paramid))
        if(!contentByLineItem){
            return res.status(400).json({
                status: "Fail",
                message:"Content By Line item  is not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          contentByLineItem,
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
      if(!project.contentByLineItems.length){
        return res.status(400).json({
          status: "Fail",
          error: "This Project didn't have any Content By Line Items",
        });
      }
   
      return res.status(200).json({
        status: "Succes",
        data: {
          contentByLineItems:project.contentByLineItems,
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
