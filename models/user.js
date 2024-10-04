const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const crypto =require('crypto')
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telephone1: {
        type: String,
        required: true,
    },
    telephone2: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    role :{ 
        type: String,
                enum : ['CLIENT','ADMIN','GUEST'],
                default: 'GUEST'
    }, 
    clients: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    isBlocked:{
         type:Boolean ,
         default :true 
    },
    userProfile: {
        type: String,  
        required: false,
      },
    verificationCode: {
        type: String,  
        required: false,
      },
    Notifications:[  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notifications',
      },],
    rendezVous: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Rdv',
        },
    ],
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    }],
 
    refreshToken:{
        type: String 
    },
    credit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credit'
    },
    adminAvaibilities:[{
   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdminAvaibility',
     }],
     depense :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Depense',
    },
    passwordChangeAt : Date  , 
    passwordResetToken : String , 
    passwordResetExpires: Date,
    verificationToken:String
},{
    timestamps:true
});
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){ 
        next()
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password , salt)
})
userSchema.methods.isPasswordMatched = async function(enteredPassword){ 
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.createPasswordResetToken= async function(){ 
    const resettoken= crypto.randomBytes(32).toString("hex")
    this.passwordResetToken=crypto.createHash('sha256')
    .update(resettoken)
    .digest("hex")
   this.passwordResetExpires= Date.now() + 30*60*1000 ; //10 minutes
   return resettoken ;
}
userSchema.methods.patchUser = async function(updates) {
    const allowedUpdates = ['firstName', 'lastName', 'email', 'mobile', 'password', 'isAdmin'];
    const updatesKeys = Object.keys(updates);
    const isValidOperation = updatesKeys.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        throw new Error('Invalid updates!');
    }
    updatesKeys.forEach((update) => {
        this[update] = updates[update];
    });
    if (updates.password) {
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(updates.password, salt);
    }
    await this.save();
};

module.exports = mongoose.model('User', userSchema);