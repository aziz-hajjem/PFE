const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Macro = require("../models/macroModel");
const YAML = require("yaml");
const fs = require("fs");
const multer = require("multer");
const zipper = require("zip-local");
const AdmZip = require("adm-zip");

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
    const {
      name,
      key,
      description,
      vendorName,
      vendorUrl,
      authentication,
      enableLicensing,
    } = req.body;

    const newProject = await Project.create({
      name: name,
      key: key,
      description: description,
      // icon:icon,
      vendor: {
        name: vendorName,
        url: vendorUrl,
      },
      authentication: authentication,
      enableLicensing: enableLicensing,
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
    const filteredBody = filterObj(
      req.body,
      "name",
      "key",
      "description",
      "authentication",
      "enableLicensing"
    );
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
    await Project.deleteOne(project);
    user.projects.pull({ _id: req.params.id });
    await user.save();
    if (project.macros) {
      project.macros.map(
        async (el) => await Macro.findByIdAndDelete(el._id.toString())
      );
    }

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
    if (!project) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: error,
        },
      });
    }
    const dataManifest = {
      modules: {
        macro: [
          {
            key: `${project.macros[0].key}`,
            function: "main",
            title: `${project.macros[0].name}`,
            description: `${project.macros[0].description}`,
          },
        ],
        function: [
          {
            key: "main",
            handler: "index.run",
          },
        ],
      },
      app: {
        id: "ari:cloud:ecosystem::app/6e5ebfab-29c8-428b-817c-1a991912cbcd",
      },
    };
    const dataIndex = `
import ForgeUI, { render, Fragment, Macro, Text } from "@forge/ui";

  const App = () => {
    return (
     <Fragment>
       {/* <Text>Hello world!</Text> */}
       <Text>${project.macros[0].name} ${project.macros[0].description} </Text>
     </Fragment>
    );
};

export const run = render(
  <Macro
    app={<App />}
  />
);
    `;
    const dataPackage=`
    {
      "name": "forge-ui-starter",
      "version": "1.0.0",
      "main": "index.js",
      "license": "MIT",
      "private": true,
      "scripts": {
        "lint": "./node_modules/.bin/eslint src/**/* || npm run --silent hook-errors",
        "hook-errors": "echo 'x1b[31mThe build failed because a Forge UI hook is being used incorrectly. Forge UI hooks follow the same rules as React Hooks but have their own API definitions. See the Forge documentation for details on how to use Forge UI hooks.' && exit 1"
      },
      "devDependencies": {
        "eslint": "^6.5.1",
        "eslint-plugin-react-hooks": "^2.1.2"
      },
      "dependencies": {
        "@forge/ui": "^0.13.1"
      }
    }
    
    `
    const doc = new YAML.Document();
    doc.contents = dataManifest;
    await fs.writeFileSync(`./aziz/manifest.yml`, doc.toString());
    await fs.writeFileSync(`./aziz/package.json`, dataPackage);
    await fs.writeFileSync(`./aziz/src/index.jsx`, dataIndex);
    const manifest = await fs.readFileSync(`./aziz/manifest.yml`, "utf8");
    console.log(manifest);
    // convert folder to zip file
    // zipper.sync.zip("./aziz/").compress().save(`${project.name}.zip`);
    const zip = new AdmZip();

    zip.addLocalFolder("./aziz");
    const downloadName = `${project.name}-${Date.now()}.zip`;

    const data = zip.toBuffer();

    // save file zip in root directory__dirname+"/"+downloadName

    zip.writeZip(`C:/Users/azizh/Downloads/${downloadName}`);

    // code to download zip file

    res.set("Content-Type", "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename=${downloadName}`);
    res.set("Content-Length", data.length);
    res.send(data);

    // return res.status(200).json({
    //   status: "Succes",
    //   data: {
    //     project,
    //   },
    // });
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
// console.log(fs.readFileSync('/manifest.yml', 'utf8'))
