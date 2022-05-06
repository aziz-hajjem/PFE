const mongoose = require("mongoose");

const SpacePageSchema = new mongoose.Schema({
  key:{
      type:String,
      trim:true,
      required:[true,"Please provide a key "]
  },
  name:{
    type:String,
    trim:true,
    required:[true,"Please provide a name "]
  },
  text:{
    type:String,
    trim:true,
    
  },
  description:{
    type:String,
    trim:true,
  },
  paramter:{
    type:[String],
    enum:[
      "Text",
      "Tag",
      "Image",
      "CheckBox",
      "Select",
      "Date",
      "User"      
    ]
  },
  text:{
    type:String
  },
  tag:{
    type:String
  },
  image:{
    type:String
  },
  checkBox:{
    type:[String]
  },
  select:{
    type:[String],
    required:false
  }
  
  
});
module.exports= SpacePageSchema