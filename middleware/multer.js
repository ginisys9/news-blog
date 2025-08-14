var multer = require('multer'),
    path = require('path'),

storage = multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,'./public/upload')
    },
    filename:function(req,file,cb){
      cb(null,Date.now() + path.extname(file.originalname))
    }
}),

fileFilter = (req,file,cb) =>{
  if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
    cb(null,true)
  }
   else{
     cb(new Error('Only jpg and PNG file are allowed'),false)
   }
},
upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*40
    },
    fileFilter:fileFilter
});
module.exports = upload;