const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Macro = require("../models/macroModel");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AdmZip = require("adm-zip");
const FileSaver = require('file-saver');





const indexTemplate = require("../templates/index");
const spaceTemplate = require("../templates/spaceSetting");
const spacePageTemplate = require("../templates/spacePage");



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
    const dataManifest = `
    modules:
     macro:
       ${project.macros.map(el=>(
        `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        description: ${el.description}
        config:
          function: ${el.name}-config
        `
      )).join('')}
      ${project.spaceSettings.length?
      `
     confluence:spaceSettings:`:""}
      ${project.spaceSettings.map(el=>(
        `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        description: ${el.description}

        `
      )).join('')}
      ${project.spacePages.length?
        `
     confluence:spacePage:`:""}
      ${project.spacePages.map(el=>(
      `
     - key: ${el.key}
       function: ${el.name}
       title: ${el.name}
       route: ${el.name}

      `
    )).join('')}
      
     function:
     ${project.macros.map(el=>(
      `
      - key: ${el.name}
        handler: ${el.name}.run
      - key: ${el.name}-config
        handler: ${el.name}.config

      `
    )).join('')}
    ${project.spaceSettings.map(el=>(
      `
      - key: ${el.name}
        handler: ${el.name}.run

      `
    )).join('')}
    ${project.spacePages.map(el=>(
      `
      - key: ${el.name}
        handler: ${el.name}.run

      `
    )).join('')}
    app:
      id: 'Please run forge register'

    `

    const dataPackage = `
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
    
    `;
    // const doc = new YAML.Document();
    // doc.contents = dataManifest;
    const dataeslint = `
    {
      "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2017,
        "ecmaFeatures": {
          "jsx": true
        }
      },
      "plugins": [
        "react-hooks"
      ],
      "rules": {
        "react-hooks/rules-of-hooks": "error"
      }
    }
    `;
    const dataGitIgnore = `
    /node_modules/
    /dist/
    /.vscode/
    .idea
    `;
    const dataReadMe = `
    this macro : ${project.macros[0].name} 
    fonctionnality :${project.macros[0].description}
    `;
    const zip = new AdmZip();
    project.macros.map(el=>{
      const paramter=el.parameter;
      var defaultConfig;
      var data;
      var config;
      paramter==="String"&&(defaultConfig=`Text:"${el.description}"`)&&(data=`<Text>{config.Text}</Text>`)&&(config=`<TextField
        name="Text"
        label="Text"
        defaultValue={defaultConfig.Text}
      />`)
      paramter==="Select"&&(defaultConfig=`Color:"red"`)&&(data=`<Tag text="${el.description}" color={config.Color}/>`)&&(config=`<Select label="colors" name="Color" >
      <Option defaultSelected label="red" value="red" />
      <Option label="green" value="green" />
      <Option label="blue" value="blue" />
      <Option label="purple" value="purple" />
      <Option label="yellow" value="yellow" />
      <Option label="teal" value="teal" />
      <Option label="red-light" value="red-light" />
  </Select>`)
       paramter==="both"&&(defaultConfig=`Color:"red",
       Text:"${el.description}"`)&&(data=`<Tag text={config.Text} color={config.Color}/>`)&&(config=`<TextField
       name="Text"
       label="Text"
       defaultValue={defaultConfig.Text}
     />
     <Select label="colors" name="color" >
     <Option defaultSelected label="red" value="red" />
     <Option label="green" value="green" />
     <Option label="blue" value="blue" />
     <Option label="purple" value="purple" />
     <Option label="yellow" value="yellow" />
     <Option label="teal" value="teal" />
     <Option label="red-light" value="red-light" />
 </Select>`)
      const indexData = {
        defaultConfig:defaultConfig,
        data: data,
        config:config
      }
      
      var dataIndex = indexTemplate(indexData);
      zip.addFile(
      `src/${el.name}.jsx`,
      Buffer.from(dataIndex, "utf8"),
      "entry comment goes here"
    );
  })
  project.spaceSettings.length&&project.spaceSettings.map(el=>{
    var spaceData;
    var dat=[];
    el.paramter.find(el=>el==="Text")&&(dat.push(`<Text>${el.text}</Text>`))
    el.paramter.find(el=>el==="Tag")&&(dat.push(`<Tag text="${el.tag}" color="red" />`))
    el.paramter.find(el=>el==="Image")&&(dat.push(`<Image size='medium' src="${el.image}" alt="image" /> `))
    el.paramter.find(el=>el==="Date")&&(dat.push(`
    <Text>
      Date of now is : <DateLozenge value={new Date().getTime()} />
    </Text> `))
    el.paramter.find(el=>el==="CheckBox")&&(dat.push(`
    <Form onSubmit={onSubmit} >
      <CheckboxGroup name="CheckBox" label="CheckBox">
          ${el.checkBox.map(el=>`<Checkbox value="${el}" label="${el}" />`).join('')}
        </CheckboxGroup>
    </Form>
    `))
    el.paramter.find(el=>el==="Select")&&(dat.push(`
    <Form onSubmit={onSubmit} >
        <Select label="Select" name="select">
          ${el.select.map(el=>`<Option value="${el}" label="${el}" />`).join('')}
        </Select>
    </Form>
    `))


    spaceData = {
      data:dat.join('')
    }
    var dataSpace= spaceTemplate(spaceData);
    zip.addFile(
    `src/${el.name}.jsx`,
    Buffer.from(dataSpace, "utf8"),
    "entry comment goes here"
  );
})
project.spacePages.length&&project.spacePages.map(el=>{
  var spaceData;
  var dat=[];
  el.paramter.find(el=>el==="Text")&&(dat.push(`<Text>${el.text}</Text>`))
  el.paramter.find(el=>el==="Tag")&&(dat.push(`<Tag text="${el.tag}" color="red" />`))
  el.paramter.find(el=>el==="Image")&&(dat.push(`<Image size='medium' src="${el.image}" alt="image" /> `))
  el.paramter.find(el=>el==="Date")&&(dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> `))
  el.paramter.find(el=>el==="CheckBox")&&(dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox.map(el=>`<Checkbox value="${el}" label="${el}" />`).join('')}
      </CheckboxGroup>
  </Form>
  `))
  el.paramter.find(el=>el==="Select")&&(dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select.map(el=>`<Option value="${el}" label="${el}" />`).join('')}
      </Select>
  </Form>
  `))


  spaceData = {
    data:dat.join('')
  }
  var dataSpace= spacePageTemplate(spaceData);
  zip.addFile(
  `src/${el.name}.jsx`,
  Buffer.from(dataSpace, "utf8"),
  "entry comment goes here"
);
})  
    
   
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
    // console.log(data)
    


    // code to download zip file
      
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
