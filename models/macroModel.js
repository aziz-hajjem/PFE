const mongoose=require('mongoose');

const paramterSchema=new mongoose.Schema({
    identifier:{
        type:String,
        unique:true,
        trim:true
    },
    name:{
        type:String,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    type:{
        type:String,
        trim:true
    },
    required:{
        type:Boolean,
    },
    multiple:{
        type:Boolean,
    }
})

const macroSchema=new mongoose.Schema({
    name: {
        type:String,
        required:[true,'please provide name for your Macro'],
        unique:true,
        trim:true
    },
    key:{
        type:String,
        required:[true,'please provide key for your macro'],
        unique:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    categories:{
        type:[String],
        enum:['administration','communication','confluence content','Development','external content','media','navigation','reporting','visuals & images']
    },
    icon:{
        type:String,
        default:"default.jpeg"
    },
    bodyType:{
        type:String,
        enum:['PLAIN_TEXT','RICH_TEXT','none'],
        default:'none'
    },
   outputType:{
        type:String,
        enum:['block','inline'],
        default:'block'
    },
    parameters :[paramterSchema ]
})

const macroModel=mongoose.model("macro",macroSchema);
module.exports=macroModel


