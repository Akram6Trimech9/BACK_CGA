const User = require('../models/user') ;
const jwt = require('jsonwebtoken') ; 
const asyncHandler=require('express-async-handler')

const authMiddleware= asyncHandler(async (req,res,next)=> { 
    let token ; 
     if(req?.headers?.authorization?.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
        try{
             if(token){ 
                const decoded = jwt.verify(token , process.env.JWT_SECRET);
                 const user = await User.findById(decoded?.id)
                 req.user= user ; 
                next();
              }

        }catch(error){
            throw new Error("Not Authorized token expired , please login again ")
        }

     }else{
        throw new Error('there is no token attached to header ') 
     }
})

const isAdmin = asyncHandler(async (req,res,next)=> {
    try{
      const {email}=req.user
      const adminUser = await User.findOne({email : email})
       if(adminUser.isAdmin){
         next() ;
       }else{
         throw new Error("Not Authorized As an Admin ")
       }
    }catch(error){ 
         throw new Error('Something wrong in the Admin middleWare')
    }
})
 module.exports = {authMiddleware , isAdmin} ; 