const mongoose=require('mongoose');
const validator = require("validator");
const Project=require('./projectModel')

const project=require('./projectModel')
const bcrypt=require('bcrypt');
const crypto=require('crypto')



const userSchema= new mongoose.Schema({
    userName:{
        type:String,
        required:[true,"Please provide your name "],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Please provide your email"],
        trim:true,
        lowercase:true,
        unique:true,
        validate:[validator.isEmail,"Please provide an correct email 📧"]
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        select:false,
        required:[true,"Please confirm Your password !"],
        validate:{
            validator:function(el){
                return el===this.password
            },
            message:"Passwords are not the same ❌"
        }
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    enable:{
        type:Boolean,
        default:true
    },
    photo:{
        type:String,
        default:'default.jpeg'
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    projects:[{ type: mongoose.Schema.Types.ObjectId, ref: 'project' } ]

})
// middleware : to crypt password for more security
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12);
    this.confirmPassword=this.password
    next()
})
// middleware : to update the passwordChangedAt property when the user update his password
userSchema.pre('save',function(next){
    if(this.isModified('password')) {
        this.passwordChangedAt=Date.now()-1000;
    }
    next()
})
// userSchema.pre(['save','find','create','findById','findByIdAndUpdate','findByIdAndDelete'],async function(next){
//     await this.populate({
//         path:'projects',
//         select:'-__v'
//     })
//     next()
// })


// userSchema.pre('save',async function(next){
//         if(this.projects.length){
//     const projectsPromise=this.projects.map(async el=>{
//         console.log(el._id.toString());
//         return await Project.findById(el._id.toString())
//     });
//     // console.log(await Promise.all(projectsPromise))
//     this.projects=await Promise.all(projectsPromise)}
//     console.log(this.projects)
//     next()
// })



// instance methode : to verify the password in the log in
userSchema.methods.passwordCorrect=async(enterdPassword,currentPassword)=>{
    return await bcrypt.compare(enterdPassword,currentPassword)
}
// instance methode : to check if the password is changed after the passwordChangedAt 
userSchema.methods.changedPasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp<changedTimestamp
    }

    // false means not changed
    return false
}
// instance methode to create resetPassword token and return it 
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000

    return resetToken

} 





const userModel=mongoose.model('user',userSchema)
module.exports=userModel;