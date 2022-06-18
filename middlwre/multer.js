const multer = require('multer')


// const storage=multer.diskStorage({
//    destination: function(req,file,cb){
//         cb(null,"./public/uploads")
//    },
//    filename: function(req,file,cb){
//        cb(null, Date.now() + file.originalname)
//    }
// })
// module.exports=store=multer({storage:storage})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads")
    },
    filename:function(req,file,cb){
        var ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null,file.fieldname+'-'+Date.now()+ext)
    }
  })
  
  module.exports = store = multer({ storage: storage })