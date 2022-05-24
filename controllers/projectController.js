const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Macro = require("../models/macroModel");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AdmZip = require("adm-zip");
const FileSaver = require("file-saver");
const dataPackage = require("../templates/dataPackage");
const indexTemplate = require("../templates/index");
const spaceTemplate = require("../templates/spaceSetting");
const spacePageTemplate = require("../templates/spacePage");
const homePageFeedTemplate = require("../templates/homePageFeed");
const globalSettingTemplate = require("../templates/globalSetting");
const globalPageTemplate = require("../templates/globalPage");
const contextMenuTemplate = require("../templates/contextMenu");
const contentActionTemplate = require("../templates/contentAction");
const contentByLineItemTemplate = require("../templates/contentByLineItem");
const manifest = require("../templates/manifest");
const forgeComponent = require("../templates/forgeComponent");
const macroCode = require("../templates/macroCode");
const dataeslintt = require("../templates/dataeslint");

// const stream = require('stream');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./views/add-on-front/src/img/icons");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `icon-${req.user.id}-${Date.now()}.${ext}`);
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
exports.uploadProjectPhoto = upload.single("icon");

exports.createProject = async (req, res, next) => {
  try {
    const { name, key, description } = req.body;
    if (!name || !key) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "There is no Data 😞 ",
        },
      });
    }

    const newProject = await Project.create({
      name: name,
      key: key,
      description: description,
    });
    if (!newProject) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Failed to create new project",
        },
      });
    }
    const user = await User.findById(req.user.id).populate("projects");
    await user.projects.push(newProject);
    await user.save();
    return res.status(201).json({
      status: "Succes",
      data: {
        newProject,
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

const filterObj = (obj, ...params) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (params.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateProject = async (req, res, next) => {
  try {
    const filteredBody = filterObj(req.body, "name", "key", "description");
    if (req.file) filteredBody.icon = req.file.filename;
    if (!req.body) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "There is no data for update",
        },
      });
    }
    const find = req.user.projects.find(
      (el) => el.toString() === req.params.id
    );
    if (!find) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "This project is not yours 😠",
        },
      });
    }
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!project) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Project is not exist !! ",
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
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Project is not exist !! ",
        },
      });
    }
    const user = await User.findById(req.user.id).populate("projects");
    const find = req.user.projects.find(
      (el) => el.toString() === req.params.id
    );
    if (!find) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "This project is not yours 😠",
        },
      });
    }
    await Project.findByIdAndDelete(req.params.id);
    user.projects.pull({ _id: req.params.id });
    await user.save();

    return res.status(201).json({
      status: "Succes",
      data: {
        find,
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

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await User.findById(req.user.id)
      .select("projects")
      .populate("projects");
    if (!projects) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "This user have not projects !! ",
        },
      });
    }

    return res.status(201).json({
      status: "Succes",
      data: {
        results: projects.projects.length,
        projects: projects.projects,
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

exports.getProject = async (req, res, next) => {
  try {
    const find = req.user.projects.find(
      (el) => el.toString() === req.params.id
    );
    if (!find) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "This project is not yours 😠",
        },
      });
    }
    // const manifest=fs.readFileSync('/manifest.yml', 'utf8')
    // console.log(manifest)
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Project not found !! ",
        },
      });
    }

    return res.status(201).json({
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

exports.generate = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("macros");
    console.log(project);
    if (!project) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: error,
        },
      });
    }
    if (
      !project.macros.length &&
      !project.spaceSettings.length &&
      !project.spacePages.length &&
      !project.contentActions.length &&
      !project.contextMenu.length &&
      !project.globalPages.length &&
      !project.globalSettings.length &&
      !project.homePageFeeds.length &&
      !project.contentByLineItems.length
    ) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Project is empty !",
        },
      });
    }
    const dataManifest = manifest(project);

    const dataeslint = dataeslintt;
    const dataGitIgnore = `
    /node_modules/
    /dist/
    /.vscode/
    .idea
    `;
    const dataReadMe = `
    this macro : ffff} 
    fonctionnality :ffff}
    `;
    const zip = new AdmZip();

    project.macros.length &&
      project.macros.map((el) => {
        macroCode(el, indexTemplate, zip);
      });

    project.spaceSettings.length &&
      project.spaceSettings.map((el) => {
        forgeComponent(el, spaceTemplate, zip);
      });

    project.spacePages.length &&
      project.spacePages.map((el) => {
        forgeComponent(el, spacePageTemplate, zip);
      });

    project.homePageFeeds.length &&
      project.homePageFeeds.map((el) => {
        forgeComponent(el, homePageFeedTemplate, zip);
      });

    project.contentByLineItems.length &&
      project.contentByLineItems.map((el) => {
        forgeComponent(el, contentByLineItemTemplate, zip);
      });

    project.contentActions.length &&
      project.contentActions.map((el) => {
        forgeComponent(el, contentActionTemplate, zip);
      });

    project.globalSettings.length &&
      project.globalSettings.map((el) => {
        forgeComponent(el, globalSettingTemplate, zip);
      });

    project.globalPages.length &&
      project.globalPages.map((el) => {
        forgeComponent(el, globalPageTemplate, zip);
      });

    project.contextMenu.length &&
      project.contextMenu.map((el) => {
        forgeComponent(el, contextMenuTemplate, zip);
      });

    zip.addFile(
      "manifest.yml",
      Buffer.from(dataManifest, "utf8"),
      "entry comment goes here"
    );
    zip.addFile(
      ".eslintrc",
      Buffer.from(dataeslint, "utf8"),
      "entry comment goes here"
    );
    zip.addFile(
      ".gitignore",
      Buffer.from(dataGitIgnore, "utf8"),
      "entry comment goes here"
    );
    zip.addFile(
      "package.json",
      Buffer.from(dataPackage, "utf8"),
      "entry comment goes here"
    );
    zip.addFile(
      "README.md",
      Buffer.from(dataReadMe, "utf8"),
      "entry comment goes here"
    );

    const data = zip.toBuffer();

    res.set("Content-type", "application/octet-stream");
    res.set("Content-disposition", `attachment; filename=${project.name}.zip`);
    res.set("Content-Length", data.length);
    res.send(data);
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
