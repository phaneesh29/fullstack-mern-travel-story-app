import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = function(req,file,cb){
    if (file.mimetype.startsWith("image/")) {
        cb(null,true)
    }
    else{
        cb(new Error("Only images are allowed"),false)
    }
}

const upload = multer({storage,fileFilter})

export default upload