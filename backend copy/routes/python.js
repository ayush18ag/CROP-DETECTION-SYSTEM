const  formdata= require("form-data");
const fs = require("fs")
const multer= require('multer');
const axios = require("axios")

const express = require("express")
const router= express.Router();
const path= require("path")
const {imge, upload}= require("../controller/co")



router.post("/send", upload.single("image"),imge)

module.exports= router
