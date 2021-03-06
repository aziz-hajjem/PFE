const express=require('express')
require('dotenv').config({ path: './config.env' })
const mongoose=require('mongoose')
const authRoute=require('./routes/authRoute')
const userRoute=require('./routes/userRoute')
const projectRoute=require('./routes/projectRoute')
const spaceSettingsRoute=require('./routes/spaceSettingRoute')
const spacePagesRoute=require('./routes/spacePageRoute')
const homePageFeedRoute=require('./routes/homePageFeedRoute')
const globalSettingRoute=require('./routes/globalSettingRoute')
const globalPageRoute=require('./routes/globalPageRoute')
const macroRoute=require('./routes/macroRoute')
const contextMenuRoute=require('./routes/contextMenuRoute')
const contentActionRoute=require('./routes/contentActionRoute')

const contentByLineItemRoute=require('./routes/contentByLineItemRoute')
const helmet=require('helmet')

const cors=require('cors')
const morgan =require('morgan')
const app=express();
const PORT=process.env.PORT;
const URL=`mongodb+srv://pfe:${process.env.DB_PASSWORD}@cluster0.9rpvx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

// connection with DB
mongoose.connect(URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(()=>app.listen(PORT,()=>{
    console.log(`We are connected to the server on port ${PORT}`);
})).catch(err=>console.log(err))

app.use(morgan('dev'))
app.use(cors({credentials: true, origin: `http://${process.env.IP_ADDRESS}:3000`}));
app.use(helmet())
app.use(express.json())
app.use('/api/pfe/auth',authRoute)
app.use('/api/pfe/user',userRoute)
app.use('/api/pfe/user/projects',projectRoute)
app.use('/api/pfe/user/projects/macros',macroRoute)
app.use('/api/pfe/user/projects/spaceSettings',spaceSettingsRoute)
app.use('/api/pfe/user/projects/spacePages',spacePagesRoute)
app.use('/api/pfe/user/projects/homePageFeeds',homePageFeedRoute)
app.use('/api/pfe/user/projects/globalSettings',globalSettingRoute)
app.use('/api/pfe/user/projects/globalPages',globalPageRoute)
app.use('/api/pfe/user/projects/contextMenu',contextMenuRoute)
app.use('/api/pfe/user/projects/contentByLineItems',contentByLineItemRoute)
app.use('/api/pfe/user/projects/contentActions',contentActionRoute)