const multer = require("multer");
const path = require("path");

 const upload = multer({
    limits: 800000,  
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/images");  
        },
        filename: (req, file, cb) => {
             let ext = path.extname(file.originalname);  
            const uniqueName = Date.now();  
            cb(null, `${uniqueName}${ext}`);  
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ["jpg", "jpeg", "png"];  
        if (allowedFileTypes.includes(file.mimetype.split("/")[1])) {
            cb(null, true); 
        } else {
            cb(null, false);  
        }
    }
});

module.exports = upload;
