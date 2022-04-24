const Project = require("../models/projectModel");

exports.createHomePageFeed=async(req,res,next)=>{
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
        if (data)
          project.homePageFeeds.push(data);
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

exports.updateHomePageFeed = async (req, res, next) => {
    try {
      const {  name, key, description, text,paramter,image,select,checkBox,tag } =
        req.body;
      const project = await Project.findOneAndUpdate(
        {
          _id: req.params.id,
          homePageFeeds: { $elemMatch: { _id: req.params.paramid } },
        }, 
        {
          $set: {
            "homePageFeeds.$.key": key,
            "homePageFeeds.$.name": name,
            "homePageFeeds.$.description": description,
            "homePageFeeds.$.paramter": paramter&&[...paramter],
            "homePageFeeds.$.select": select&&[...select],
            "homePageFeeds.$.checkBox": checkBox&&[...checkBox],
            "homePageFeeds.$.image": image,
            "homePageFeeds.$.tag": tag,
            "homePageFeeds.$.text": text,

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

exports.deleteHomePageFeed = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      project.homePageFeeds.pull({ _id: req.params.paramid });
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

exports.getHomePageFeed = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      var homePageFeed
        project.homePageFeeds&&(homePageFeed=project.homePageFeeds.find(el=>el._id.toString()===req.params.paramid))
        if(!homePageFeed){
            return res.status(400).json({
                status: "Fail",
                message:"Home Page feed  is not found !"
              });
        }
      return res.status(200).json({
        status: "Succes",
        data: {
          homePageFeed,
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
      if(!project.homePageFeeds.length){
        return res.status(400).json({
          status: "Fail",
          error: "This Project didn't have any space Page",
        });
      }
   
      return res.status(200).json({
        status: "Succes",
        data: {
          homePageFeeds:project.homePageFeeds,
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
