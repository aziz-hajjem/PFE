const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema({
    name: {
        type:String,
        required:[true,'please provide name for your project'],
        unique:true,
        trim:true
    },
    key:{
        type:String,
        required:[true,'please provide key for your project'],
        unique:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    vendor:{
        name:{
            type:String,
            required:[true,"Please provide a vendor name"],
            trim:true,

        },
        url:{
            type:String,
            required:[true,"Please provide a vendor URL"],
            trim:true,
        }
    },
    icon:{
        type:String,
        default:"default.jpeg"
    },
    authentication:{
        type:String,
        required:[true,"Please provide the authentication method"],
        trim:true,
        default:"jwt"
    },
    enableLicensing:{
        type:Boolean,
        required:[true,"Please provide the enableLicensing "]
    }
})

const projectModel=mongoose.model("project",projectSchema);
module.exports=projectModel


