const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Macro = require("../models/macroModel");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AdmZip = require("adm-zip");
const FileSaver = require("file-saver");
const dataPackage=require('../templates/dataPackage')
const indexTemplate = require("../templates/index");
const spaceTemplate = require("../templates/spaceSetting");
const spacePageTemplate = require("../templates/spacePage");
const homePageFeedTemplate = require("../templates/homePageFeed");
const globalSettingTemplate = require("../templates/globalSetting");
const globalPageTemplate = require("../templates/globalPage");
const contextMenuTemplate = require("../templates/contextMenu");
const contentActionTemplate = require("../templates/contentAction");
const contentByLineItemTemplate = require("../templates/contentByLineItem");



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
    } = req.body;

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
    const filteredBody = filterObj(
      req.body,
      "name",
      "key",
      "description",
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
    const project = await Project.findById(req.params.id).populate('macros');
    console.log(project)
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
    ${
      project.macros.length
        ? `
     macro:`
        : ""
    }
       ${project.macros
         .map(
           (el) =>
             `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        description: ${el.description}
        ${(el.text||el.tag)?(`
        config:
          function: ${el.name}-config`):""}
        `
         )
         .join("")}
      ${
        project.spaceSettings.length
          ? `
     confluence:spaceSettings:`
          : ""
      }
      ${project.spaceSettings
        .map(
          (el) =>
            `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        description: ${el.description}

        `
        )
        .join("")}
      ${
        project.spacePages.length
          ? `
     confluence:spacePage:`
          : ""
      }
      ${project.spacePages
        .map(
          (el) =>
            `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        route: ${(el.name).toLowerCase()}

      `
        )
        .join("")}

        ${
          project.globalSettings.length
            ? `
     confluence:globalSettings:`
            : ""
        }
        ${project.globalSettings
          .map(
            (el) =>
              `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        description: ${el.description}
  
        `
          )
          .join("")}
          ${
            project.globalPages.length
              ? `
     confluence:globalPage:`
              : ""
          }
          ${project.globalPages
            .map(
              (el) =>
                `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        route: ${(el.name).toLowerCase()}
    
          `
            )
            .join("")}                
    ${
      project.homePageFeeds.length
        ? `
     confluence:homepageFeed:`
        : ""
    }
    ${project.homePageFeeds
      .map(
        (el) =>
          `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        description: ${el.description}

    `
      )
      .join("")}
      ${
        project.contextMenu.length
          ? `
     confluence:contextMenu:`
          : ""
      }
      ${project.contextMenu
        .map(
          (el) =>
            `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
  
      `
        )
        .join("")}
        ${
          project.contentByLineItems.length
            ? `
     confluence:contentBylineItem:`
            : ""
        }
        ${project.contentByLineItems
          .map(
            (el) =>
              `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
        tooltip: ${el.tooltip}
        description: ${el.description}
        `
          )
          .join("")}
          ${
            project.contentActions.length
              ? `
     confluence:contentAction:`
              : ""
          }
          ${project.contentActions
            .map(
              (el) =>
                `
      - key: ${el.key}
        function: ${el.name}
        title: ${el.name}
          `
            )
            .join("")}
          
      
     function:
     ${project.macros
       .map(
         (el) =>
           `
      - key: ${el.name}
        handler: ${el.name}.run
        ${(el.text||el.tag)?(`
      - key: ${el.name}-config
        handler: ${el.name}.config`):""}

      `
       )
       .join("")}
    ${project.spaceSettings
      .map(
        (el) =>
          `
      - key: ${el.name}
        handler: ${el.name}.run

      `
      )
      .join("")}
    ${project.spacePages
      .map(
        (el) =>
          `
      - key: ${el.name}
        handler: ${el.name}.run

      `
      )
      .join("")}
    ${project.homePageFeeds
      .map(
        (el) =>
          `
      - key: ${el.name}
        handler: ${el.name}.run

      `
      )
      .join("")}
      ${project.globalSettings
        .map(
          (el) =>
            `
      - key: ${el.name}
        handler: ${el.name}.run
  
        `
        )
        .join("")}
        ${project.globalPages
          .map(
            (el) =>
              `
      - key: ${el.name}
        handler: ${el.name}.run
    
          `
          )
          .join("")}
          ${project.contextMenu
            .map(
              (el) =>
                `
      - key: ${el.name}
        handler: ${el.name}.run
      
            `
            )
            .join("")}
            ${project.contentByLineItems
              .map(
                (el) =>
                  `
      - key: ${el.name}
        handler: ${el.name}.run
        
              `
              )
              .join("")}
              ${project.contentActions
                .map(
                  (el) =>
                    `
      - key: ${el.name}
        handler: ${el.name}.run
          
                `
                )
                .join("")}
    app:
      id: 'Please run forge register'
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
    this macro : ffff} 
    fonctionnality :ffff}
    `;
    const zip = new AdmZip();

project.macros.map((el) => {
        var macro;
        var dat = [];
        var conf=[];
        var def=[];
        const defaultColor=`Color:"red"
        `
        const defaultConfigColor=`
        <Select label="colors" name="color" >
        <Option defaultSelected label="red" value="red" />
        <Option label="green" value="green" />
        <Option label="blue" value="blue" />
        <Option label="purple" value="purple" />
        <Option label="yellow" value="yellow" />
        <Option label="teal" value="teal" />
        <Option label="red-light" value="red-light" />
      </Select>
      `
        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>{config.Text}</Text>
    `)&&conf.push(`<TextField
    name="Text"
    label="Text"
    defaultValue={defaultConfig.Text}
  />
  `)&&def.push(`Text:"${el.text}"
  `)
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color={config.Color}/>
    `)&&(!def.find(el=>el===defaultColor)&&def.push(defaultColor)&&conf.push(defaultConfigColor))
        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" />
     `);
        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`<Tag text={config.checkBox} color={config.Color}/>
    `)&&conf.push(`
    <CheckboxGroup name="checkBox" label="checkBox">
          ${el.checkBox
            .map(
              (el) => `<Checkbox value="${el}" label="${el}" />
          `
            )
            .join("")}
        </CheckboxGroup>
    `)&&def.push(`
    checkBox:"checkBox"
    `)&&(!def.find(el=>el===defaultColor)&&def.push(defaultColor)&&conf.push(defaultConfigColor))
    el.paramter.find((el) => el === "Select") &&
    dat.push(`<Tag text={config.select} color={config.Color}/>
`)&&conf.push(`
<Select name="select" label="select">
    ${el.select
      .map(
        (el) => `<Option value="${el}" label="${el}" />
    `
      )
      .join("")}
  </Select>
`)&&def.push(`
select:"select"
`)&&(!def.find(el=>el===defaultColor)&&def.push(defaultColor)&&conf.push(defaultConfigColor))

        macro = {
          data: dat.join(""),
          defaultConfig:(el.paramter.find(el=>el==="Text")||el.paramter.find(el=>el==="Tag")||el.paramter.find(el=>el==="Select")||el.paramter.find(el=>el==="CheckBox"))&&(`const defaultConfig = {
            ${def.join(",")}
          };
          `),
          config:(el.paramter.find(el=>el==="Text")||el.paramter.find(el=>el==="Tag")||el.paramter.find(el=>el==="Select")||el.paramter.find(el=>el==="CheckBox"))&&( `
const Config = () => {
   return (
      <MacroConfig>
          ${conf.join("")}
      </MacroConfig>
            );
};
                    
export const config = render(<Config />);
`),
        };
       
        var macroData = indexTemplate(macro);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(macroData, "utf8"),
          "entry comment goes here"
        );
      });






//
    project.spaceSettings.length &&
      project.spaceSettings.map((el) => {
        var spaceData;
        var dat = [];
        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
    `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
    `);
        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" />
     `);
        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
    <Form onSubmit={onSubmit} >
      <CheckboxGroup name="CheckBox" label="CheckBox">
          ${el.checkBox
            .map(
              (el) => `<Checkbox value="${el}" label="${el}" />
          `
            )
            .join("")}
        </CheckboxGroup>
    </Form>
    `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
    <Form onSubmit={onSubmit} >
        <Select label="Select" name="select">
          ${el.select
            .map(
              (el) => `<Option value="${el}" label="${el}" />
          `
            )
            .join("")}
        </Select>
    </Form>
    `);

        spaceData = {
          data: dat.join(""),
        };
        var dataSpace = spaceTemplate(spaceData);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataSpace, "utf8"),
          "entry comment goes here"
        );
      });
      //////////

    project.spacePages.length &&
      project.spacePages.map((el) => {
        var spaceData;
        var dat = [];
        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
  `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
  `);
        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" />
   `);

        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox
          .map(
            (el) => `<Checkbox value="${el}" label="${el}" />
        `
          )
          .join("")}
      </CheckboxGroup>
  </Form>
  `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select
          .map(
            (el) => `<Option value="${el}" label="${el}" />
        `
          )
          .join("")}
      </Select>
  </Form>
  `);

        spaceData = {
          data: dat.join(""),
        };
        var dataSpace = spacePageTemplate(spaceData);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataSpace, "utf8"),
          "entry comment goes here"
        );
      });


      //////////////
    project.homePageFeeds.length &&
      project.homePageFeeds.map((el) => {
        var homePageFeed;
        var dat = [];

        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
  `);

        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" /> 
  `);

        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox
          .map((el) => `<Checkbox value="${el}" label="${el}" />`)
          .join("")}
      </CheckboxGroup>
  </Form>
  `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select
          .map((el) => `<Option value="${el}" label="${el}" />`)
          .join("")}
      </Select>
  </Form>
  `);

        homePageFeed = {
          data: dat.join(""),
        };
        var dataHomePageFeed = homePageFeedTemplate(homePageFeed);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataHomePageFeed, "utf8"),
          "entry comment goes here"
        );
      });


      ///////
       project.contentByLineItems.length &&
      project.contentByLineItems.map((el) => {
        var contentByLineItem;
        var dat = [];

        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
  `);

        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" /> 
  `);

        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox
          .map((el) => `<Checkbox value="${el}" label="${el}" />`)
          .join("")}
      </CheckboxGroup>
  </Form>
  `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select
          .map((el) => `<Option value="${el}" label="${el}" />`)
          .join("")}
      </Select>
  </Form>
  `);

        contentByLineItem = {
          data: dat.join(""),
        };
        var dataContentByLineItem = contentByLineItemTemplate(contentByLineItem);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataContentByLineItem, "utf8"),
          "entry comment goes here"
        );
      });


      /////
      project.contentActions.length &&
      project.contentActions.map((el) => {
        var contentAction;
        var dat = [];

        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
  `);

        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" /> 
  `);

        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox
          .map((el) => `<Checkbox value="${el}" label="${el}" />`)
          .join("")}
      </CheckboxGroup>
  </Form>
  `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select
          .map((el) => `<Option value="${el}" label="${el}" />`)
          .join("")}
      </Select>
  </Form>
  `);

        contentAction = {
          title:el.name,
          data: dat.join(""),
        };
        var dataContentAction = contentActionTemplate(contentAction);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataContentAction, "utf8"),
          "entry comment goes here"
        );
      });

      /////////
      project.globalSettings.length &&
      project.globalSettings.map((el) => {
        var spaceData;
        var dat = [];
        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
  `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
  `);
        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" />
   `);

        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox
          .map(
            (el) => `<Checkbox value="${el}" label="${el}" />
        `
          )
          .join("")}
      </CheckboxGroup>
  </Form>
  `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select
          .map(
            (el) => `<Option value="${el}" label="${el}" />
        `
          )
          .join("")}
      </Select>
  </Form>
  `);

        spaceData = {
          data: dat.join(""),
        };
        var dataSpace = globalSettingTemplate(spaceData);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataSpace, "utf8"),
          "entry comment goes here"
        );
      });



/////////
      project.globalPages.length &&
      project.globalPages.map((el) => {
        var spaceData;
        var dat = [];
        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
  `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
  `);
        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" />
   `);

        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox
          .map(
            (el) => `<Checkbox value="${el}" label="${el}" />
        `
          )
          .join("")}
      </CheckboxGroup>
  </Form>
  `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select
          .map(
            (el) => `<Option value="${el}" label="${el}" />
        `
          )
          .join("")}
      </Select>
  </Form>
  `);

        spaceData = {
          data: dat.join(""),
        };
        var dataSpace = globalPageTemplate(spaceData);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataSpace, "utf8"),
          "entry comment goes here"
        );
      });

      //////////
      project.contextMenu.length &&
      project.contextMenu.map((el) => {
        var contextData;
        var dat = [];
        el.paramter.find((el) => el === "User") &&
          dat.push(`<User accountId={context.accountId} />
  `);
        el.paramter.find((el) => el === "Date") &&
          dat.push(`
  <Text>
    Date of now is : <DateLozenge value={new Date().getTime()} />
  </Text> 
  `);
        el.paramter.find((el) => el === "Text") &&
          dat.push(`<Text>${el.text}</Text>
  `);
        el.paramter.find((el) => el === "Tag") &&
          dat.push(`<Tag text="${el.tag}" color="red" />
  `);
        el.paramter.find((el) => el === "Image") &&
          dat.push(`<Image size='medium' src="${el.image}" alt="image" />
   `);

        el.paramter.find((el) => el === "CheckBox") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
    <CheckboxGroup name="CheckBox" label="CheckBox">
        ${el.checkBox
          .map(
            (el) => `<Checkbox value="${el}" label="${el}" />
        `
          )
          .join("")}
      </CheckboxGroup>
  </Form>
  `);
        el.paramter.find((el) => el === "Select") &&
          dat.push(`
  <Form onSubmit={onSubmit} >
      <Select label="Select" name="select">
        ${el.select
          .map(
            (el) => `<Option value="${el}" label="${el}" />
        `
          )
          .join("")}
      </Select>
  </Form>
  `);

        contextData = {
          data: dat.join(""),
        };
        var dataContextMenu = contextMenuTemplate(contextData);
        zip.addFile(
          `src/${el.name}.jsx`,
          Buffer.from(dataContextMenu, "utf8"),
          "entry comment goes here"
        );
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
