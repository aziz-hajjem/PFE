const mongoose = require("mongoose");
const YAML = require("yaml");
const fs=require('fs')

const paramterSchema = new mongoose.Schema({
  identifier: {
    type: String,
    // unique: true,
    trim: true,
  },
  paramterName: {
    type: String,
    // unique: true,
    trim: true,
  },
  paramterDescription: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  required: {
    type: Boolean,
  },
  multiple: {
    type: Boolean,
  },
});

const macroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name for your Macro"],
    unique: true,
    trim: true,
  },
  key: {
    type: String,
    required: [true, "please provide key for your macro"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  categories: {
    type: [String],
    enum: [
      "administration",
      "communication",
      "confluence content",
      "Development",
      "external content",
      "media",
      "navigation",
      "reporting",
      "visuals & images",
    ],
  },
  icon: {
    type: String,
    default: "default.jpeg",
  },
  bodyType: {
    type: String,
    enum: ["PLAIN_TEXT", "RICH_TEXT", "none"],
    default: "none",
  },
  outputType: {
    type: String,
    enum: ["block", "inline"],
    default: "block",
  },
  parameters: [paramterSchema],
});

macroSchema.pre("save", async function (next) {
  const data = {
    modules: {
      macro: [
        {
          key: `${this.key}`,
          function: "main",
          title: `${this.name}`,
          description: `${this.description}`,
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
  const doc = new YAML.Document();
  doc.contents = data;
  await fs.writeFile("manifest.yml",doc.toString(),(err)=>console.log(err))
  next();
});

const macroModel = mongoose.model("macro", macroSchema);
module.exports = macroModel;
