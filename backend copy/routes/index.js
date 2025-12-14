const express = require("express")
const router = express()
const multer = require('multer')
const {image , fileFilter,storageEngine,upload ,imge}= require("../controller/co")
const path = require('path')


router.get("/",(req,res,next)=>{
    res.render("index.ejs")
})
router.post("/upload", upload.single("image"),imge)

// router.post("/send", upload.single("image"),imge)

module.exports = router