
const {default : mongoose } = require('mongoose')
const dbConnect=() => { 
     try{ 
     const conn =  mongoose.connect(process.env.MONGODB_URL)
     console.log("connected succefully");

    } catch(error){ 
         console.log("database Error");
    }    
}

module.exports = dbConnect ; 