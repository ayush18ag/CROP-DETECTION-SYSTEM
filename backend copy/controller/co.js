const express = require("express");
const multer = require('multer')
const storage = require('../')

const formdata = require("form-data");
const form = new FormData();

const fs = require("fs")

const axios = require("axios")



const path = require("path")


const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define where to save the files
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const image = async (req, res, next) => {
    console.log("File successfully processed by Multer:", req.file);
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded or file filter rejected the file." });
    }
    res.status(200).json({ success: true, message: 'File received and processed.' });
};

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
        cb(null, true)

    }
    else {
        cb(new Error('Invalid file type. Only images are allowed!'), false);
    }

}
const upload = multer({
    storage: storageEngine,
    fileFilter: fileFilter
});

const uploa = multer({dest: "public/uploads/"})

const imge = async function (req, res, next) {
    console.log("file recive the multer", req.file)
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded or file filter rejected the file." });
    }
    try {
        const form = formdata()
        form.append("file", fs.createReadStream(req.file.path));
        const response = await axios.post(
            "http://127.0.0.1:3000/process_image",
            form,
            { headers: form.getHeaders() }
            // {"Content-Type": "multipart/form-data",}
        )
        console.log("response from python ", response.data )
       res.status(200).json(response.data);
      

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    image,
    fileFilter,
    storageEngine,
    upload,
    imge,
    uploa,
}