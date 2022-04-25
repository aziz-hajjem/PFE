const mongoose=require('mongoose');
const Macros=require('./macroModel');
const SpaceSettings=require('./SpaceSettingsSchema')
const SpacePage=require('./SpacePageSchema');
const HomePageFeed=require('./homePageFeedSchema')
const GlobalSettings=require('./globalSettingSchema')
const GlobalPages=require('./globalPageSchema')
const ContextMenu=require('./contextMenuSchema')
const ContentAction=require('./contentActionSchema')

const ContentByLineItem=require('./contentByLineItemSchema')





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
    icon:{
        type:String,
        default:"default.png"
    },
    macros:[Macros],
    spaceSettings:[SpaceSettings],
    spacePages:[SpacePage],
    homePageFeeds:[HomePageFeed],
    globalSettings:[GlobalSettings],
    globalPages:[GlobalPages],
    contextMenu:[ContextMenu],
    contentByLineItems:[ContentByLineItem],
    contentActions:[ContentAction]




})

const projectModel=mongoose.model("project",projectSchema);
module.exports=projectModel


