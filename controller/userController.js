const User = require('../models/user')
 
const {generateToken} = require('../config/jwt')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoDbId')
const {generateRefreshToken} =require('../config/refreshToken')
const { sendEmailWithAttachments, sendWelcomeWithCredentials, sendCredentielToSousAdmin, sendCredentielToClient } = require('../services/emailService');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();
const Guest = require('../models/guest')
const Rdv = require('../models/rdv')
const Cabinet = require('../models/cabinet')

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(req.body)
  const findUser = await User.findOne({ email });

  if (findUser) {
    throw new Error('User already exists');
  } else {
     let userProfilePath = null;
    if (req.file) {
      userProfilePath = `${process.env.BACKEND_URL}/uploads/images/${req.file.filename}`; 
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);  

     const newUser = new User({
      ...req.body,
      userProfile: userProfilePath, 
      verificationCode
    });

    await newUser.save();

     const path = "templates/validate-account.html";
    await sendEmailWithAttachments(
      newUser.email, 
      'akramtrimech97@gmail.com', 
      'Verification Code', 
      path, 
      null, 
      verificationCode.toString()
    );

    res.status(201).json(newUser);
  }
});

const createUserForGuest = asyncHandler(async (req, res) => {
  const { idGuest } = req.params;
  const { email } = req.body;
  
  const findUser = await User.findOne({ email });
  if (findUser) {
    return res.status(400).json({ message: 'User already exists' }); // Return an error response
  }

  let userProfilePath = null;
  if (req.file) {
    userProfilePath = `${process.env.BACKEND_URL}/uploads/images/${req.file.filename}`;
  }

  const newUser = new User({
    ...req.body,
    userProfile: userProfilePath,
    isBlocked: false,
    verificationCode: ''
  });

  const saved = await newUser.save();
  
  await sendWelcomeWithCredentials(req.body.email, req.body.email, req.body.password);
  
  await Guest.findByIdAndUpdate(idGuest, { $set: { client: saved._id } });
  
  const rdvCreated = await Rdv.findOne({ guest: idGuest });
  
  // Ensure rdvCreated exists before updating
  if (rdvCreated) {
    await Rdv.findByIdAndUpdate(rdvCreated._id, {
      $set: {
        rdvBy: 'client',
        user: saved._id
      }
    });
  }

  res.status(201).json(saved);
});

const verifyAccountWithCode = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;
  
  try {
    const user = await User.findOne({ email });
    console.log(verificationCode)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
      if (user.verificationCode === verificationCode) {
       const updatedUser = await User.findByIdAndUpdate(user._id, { 
        $set: {
          isBlocked: false,
          verificationCode: ''
        }
      }, { new: true });  

      if (updatedUser) {
        return res.status(200).json({ message: 'Account verified successfully', verified: true });
      } else {
        return res.status(500).json({ message: 'Error updating user details' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


 const login = asyncHandler( async(req,res)=> { 
   const { email , password } = req.body ; 
     const isUser = await User.findOne({email : email })
   
     const test = await isUser.isPasswordMatched(password)
     console.log(test  , password,"test")
     if( isUser && await isUser.isPasswordMatched(password)){ 
      const refreshToken = await generateRefreshToken(isUser?._id)
      const updateUser = await User.findOneAndUpdate(isUser?._id, { 
         refreshToken: refreshToken
      },{ 
        new : true 
      }
      )
      res.cookie('refreshToken',refreshToken , { 
         httpOnly:true , 
         maxAge:72*60*60*1000
      })
       res.json({
         _id : isUser?._id ,
         firstname : isUser?.firstName , 
         lastname : isUser?.lastName , 
         token:generateToken( isUser?._id) , 
         isBlocked: isUser?.isBlocked

       });
    }else{
      throw new Error("invalid credentiels")
    }
})


 const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

     if (!user.role === 'ADMIN') {
      throw new Error('Not Authorized');
    }
    console.log(user)

    if (user && (await user.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(user?._id);
      const updateUser = await User.findByIdAndUpdate(
        user?._id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
        }
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      res.json({
        _id: user?._id,
        firstname: user?.firstname,
        lastname: user?.lastname,
        role: user?.role,
        token: generateToken(user?._id),
      });
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw new Error(error);
  }
});

 const handleRefreshToken = asyncHandler(async (req, res )=> {
const cookie = req.cookies ; 
 if(!cookie?.refreshToken){ 
  throw new Error('no refresh Token ')
}else { 
    const refreshToken = cookie.refreshToken
    console.log(refreshToken);
     const user = await User.findOne({refreshToken  : refreshToken})
     if(!user) throw new Error('No refresh Token present in db or not matched  ')
     jwt.verify(refreshToken, process.env.JWT_SECRET ,( err , decoded ) => { 
      if(err || user.id !== decoded.id){
         throw new Error("there is something wrong with refrsh token")
     }
     const accessToken = generateToken(user?._id)
     res.json({accessToken})
    })
}
 })


   const logout = asyncHandler( async ( req, res )=>{ 
    const cookie = req.cookies ; 
     if(!cookie?.refreshToken) throw new Error('No refresh Token in cookies ');
    const refreshToken = cookie.refreshToken ; 
    const user =  await User.findOne({refreshToken})
    if(!user){
         res.clearCookie("refreshTokens", {
           httpOnly : true,
           secure:true
         }) ; 
         return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken: refreshToken} , { 
      refreshToken : "" 
    }) ; 
    res.clearCookie("refreshToken",{ 
       httpOnly: true , 
       secure:true
    })
    return res.sendStatus(204);
 } )
 const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Destructure the fields you want to allow for updates
  const { username, email, telephone1, dateOfBirth, address } = req.body;

  try {
    // Find the user and update only the fields specified
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          email,
          telephone1,
          dateOfBirth,
          address
        }
      },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Error updating user', error });
  }
 
});



 const blockUser = asyncHandler(async (req,res)=>{
   const { id } = req.params 
   validateMongoDbId(id)
  try{
     const block = await User.findOneAndUpdate({_id : id } ,{ 
      isBlocked : true 
     }, 
      {
        new :true 
      } )
     if(block){ 
      res.json(block)
     }else{ 
       throw new Error('user not founded ')
     }
   }catch(error){ 
     throw new Error(error)
   }
} )


const sendVerificationLink = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
      const user = await User.findById(id);
      if (!user) {
          throw new Error('User not found');
      }
      
      let verificationToken = user.verificationToken;
      if (!verificationToken) {
           verificationToken = crypto.randomBytes(32).toString("hex");
          user.verificationToken = verificationToken;
          await user.save();
      }

      const path = "templates/validate-account.html";
      const resetURL = `${process.env.VERIFICATION_LINK}/${verificationToken}`;
      await sendEmailWithAttachments(user.email, 'akramtrimech97@gmail.com', 'Verification Link', path, null, resetURL);
      
      res.json({ message: 'Verification link sent successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

const unBlockUser = asyncHandler(async (req,res)=>{
  const { id } = req.params 
  validateMongoDbId(id)
 try{
    const block = await User.findOneAndUpdate({_id : id } ,{ 
     isBlocked : false 
    }  ,  
  {
    new :true 
  } )
    if(block){ 
     res.json(block)
    }else{ 
      throw new Error('user not founded ')
    }
  }catch(error){ 
    throw new Error(error)
  }
} )


//Get all users 
//asyncHandler => for async 
//try catch here for catch if an error appear and a synchrounous 

const getAllUsers = asyncHandler( async (req , res) => { 
  try{
    const getUsers = await User.find()
    res.json(getUsers);
  }catch(error){ 
    throw new Error(error) ; 
  }
})

//single-user

const  getOneUser = asyncHandler(async (req , res )=> { 
  const {id}  = req.params
  validateMongoDbId(id)
    try{ 
           const  user = await User.findOne({_id : id })
      if(user){
        res.json(user)
      }else{
         res.json({message : 'user does not exist'})
       }
    }catch(error){
      throw new Error(error) ; 
    }
})
// delete user 
const deleteUser = asyncHandler(async ( req , res )=> {
  const {id} = req.params 
  validateMongoDbId(id)
  try {
    const deleteUser = await User.findByIdAndDelete(id)
    if(deleteUser){
        res.json(deleteUser)
    }else{ 
      res.json({message : 'something went wrong '})

    }
  }catch(error){

  }
})

const updatePassword = asyncHandler(async (req,res )=> {
   const {id} = req.params ; 
   const password = req.body.password;
    validateMongoDbId(id); 
   const user = await User.findById(id)
   if(password){ 
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword)
   }
   else{
      res.json(user)
    }
   }
)
 const forgotPasswordToken = asyncHandler(async ( req ,res )=> {
  const {email } = req.body ; 
  console.log(email,"email")
  const user = await User.findOne({email :email}) ; 
  if(!user) throw new Error('User not found with this email ')
  try{
   const token = await   user.createPasswordResetToken() 
   await user.save()
   const path = "templates/reset-password.html" ;
   const  resetURL= `${process.env.RESET_LINK}${token}`
   console.log(email)
   await sendEmailWithAttachments(email ,'akramtrimech97@gmail.com','reset password link ', path ,null,resetURL )
  res.json(token) 
  }catch(error){ 
       throw new Error(error)
    }
   }

   )
   const resetPassword = asyncHandler(async (req,res )=> { 
    try{  
    const {password } = req.body
    console.log(password)
      const {token} = req.params ; 


     const hashedToken= crypto.createHash("sha256").update(token).digest("hex")
     const user = await User.findOne({ 
      passwordResetToken: hashedToken ,
      passwordResetExpires :{$gt: Date.now()}
     })
    if(!user){
        res.status(403).json({message :" Token Expired , please Try Again  later"  })
     }
    user.password= password ; 
    user.passwordResetToken=undefined
    user.passwordResetExpires= undefined   
    await user.save()
    res.json(user)
  }catch(error){ 
     throw new Error(error)
  }
  }
   )
   
   const verifiedAccount=async(req,res)=>{ 
     const {token} = req.params
      try { 
          const user = await  User.findOne({verificationToken: token })
          const updatedIsBlocked  = await User.findOneAndUpdate(user._id ,{$set:{
            isBlocked: false
          }} )
          console.log(user)
          if(user){
             res.status(201).json({
               verified : true 
             })
          }else{ 
             res.status(404).json({
               message: 'user not  found '
             })
          }
      }catch(error){ 
         res.status(500).json(error)
      }
   }

const getAvocats = async (req, res) => {
    try {
      const avocats = await User.find({$or: [{ role: 'ADMIN' }, { role: 'SOUS_ADMIN' }]});
        res.status(200).json({
            success: true,
            data: avocats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
const getClients = async (req, res) => {
  const {avocatId }= req.params
  try {
      const avocat = await User.findOne({_id:avocatId}).populate('clients')
      res.status(200).json({
          success: true,
          data: avocat.clients
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Server Error',
          error: error.message
      });
  }
};
const searchClients = async (req, res) => {
  const { avocatId } = req.params;
  const { query: searchTerm } = req.query;  

  try {
    const avocat = await User.findById(avocatId).populate('clients');

     if (!avocat) {
      return res.status(404).json({
        success: false,
        message: 'Avocat not found'
      });
    }

    const filteredClients = avocat.clients.filter(client => {
      const fullName = `${client.lastname} ${client.username}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

    res.status(200).json({
      success: true,
      data: filteredClients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
const addClientForAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const { adminId } = req.params;

      const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

     let userProfilePath = null;
    if (req.file) {
      userProfilePath = `${process.env.BACKEND_URL}/uploads/images/${req.file.filename}`;
    }

     const newUser = new User({
      ...req.body,
      userProfile: userProfilePath,
      isBlocked: false,
      verificationCode: ''
    });

     const saved = await newUser.save();

     const updateAdmin = await User.findByIdAndUpdate(
      adminId,
      { $push: { clients: saved._id } },
      { new: true }
    );


 

     if (updateAdmin) {
       await sendCredentielToClient(req.body.email, req.body.email, req.body.password, updateAdmin);
      return res.status(201).json(saved);
    } else {
      return res.status(400).json({ message: 'Something went wrong during the update process' });
    }
  } catch (error) {
     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const addSousAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const { adminId } = req.params;

    console.log(req.body)
     const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

     let userProfilePath = null;
    if (req.file) {
      userProfilePath = `${process.env.BACKEND_URL}/uploads/images/${req.file.filename}`;
    }

     const newUser = new User({
      ...req.body,
      userProfile: userProfilePath,
      isBlocked: false,
      verificationCode: ''
    });

     const saved = await newUser.save();

     const updateAdmin = await User.findByIdAndUpdate(
      adminId,
      { $push: { sousAdminList: saved._id } },
      { new: true }
    );

     const updateSousAdmin = await User.findByIdAndUpdate(
      saved._id,
      { $push: { underAdmin: adminId } },
      { new: true }
    );

     const updateCabinet = await Cabinet.findOneAndUpdate(
      { admin: adminId },
      { $push: { sousAdmins: saved._id } },
      { new: true }
    );

     if (updateAdmin && updateSousAdmin && updateCabinet) {
       await sendCredentielToSousAdmin(req.body.email, req.body.email, req.body.password, updateCabinet);
      return res.status(201).json(saved);
    } else {
      return res.status(400).json({ message: 'Something went wrong during the update process' });
    }
  } catch (error) {
     return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports = {addSousAdmin, addClientForAdmin , createUserForGuest,searchClients,verifyAccountWithCode,getClients, getAvocats ,verifiedAccount , sendVerificationLink, loginAdmin , resetPassword , forgotPasswordToken ,  updatePassword , logout ,  handleRefreshToken , createUser, login , getAllUsers , getOneUser , deleteUser , updateUser ,blockUser , unBlockUser } ;