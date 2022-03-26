const mongoose = require("mongoose");

const SpaceSettingsSchema = new mongoose.Schema({
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
  
  
});
module.exports= SpaceSettingsSchema