const mongoose = require("mongoose");

const GlobalSettingSchema = new mongoose.Schema({
  key:{
      type:String,
      trim:true,
      unique:[true,"Key is already used "],
      required:[true,"Please provide a key "]
  },
  name:{
    type:String,
    trim:true,
    unique:[true,"Name is already used "],
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
  }
  
  
});
module.exports= GlobalSettingSchema