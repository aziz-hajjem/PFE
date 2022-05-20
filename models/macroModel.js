const mongoose = require("mongoose");

// const paramterSchema = new mongoose.Schema({
//   identifier: {
//     type: String,
//     // unique: true,
//     trim: true,
//   },
//   paramterName: {
//     type: String,
//     // unique: true,
//     trim: true,
//   },
//   paramterDescription: {
//     type: String,
//     trim: true,
//   },
//   type: {
//     type: String,
//     trim: true,
//   },
//   required: {
//     type: Boolean,
//   },
//   multiple: {
//     type: Boolean,
//   },
// });

const macroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name for your Macro"],
    trim: true,
    
  },
  key: {
    type: String,
    required: [true, "please provide key for your macro"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
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

macroSchema.pre('save',function(next){
  this.key=this.key.split(' ').join('-')
  next()
})



// const macroModel = mongoose.model("macro", macroSchema);
module.exports = macroSchema;
