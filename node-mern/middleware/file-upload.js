const multer = require("multer");
const { v4 }=require("uuid")


const MIME_TYPES={
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png'
}
const fileUpload = multer({ 
    storage: multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads/images')
        },
       filename:(req, file, cb)=>{
           cb(null, v4()+"_"+file.originalname)
       }
        }),
    fileFilter:(req,file,callback)=>{
        isValid=!!MIME_TYPES[file.mimetype]
        err=isValid ?null:new Error('file mimetype error')
        callback(err,isValid)
    }
});

module.exports = fileUpload;
