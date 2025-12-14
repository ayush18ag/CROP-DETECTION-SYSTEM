const  formdata= require("form-data");
const fs = require("fs")
const express= require('express');
const app = express();
const port = 8000;
const path = require ('path');
const us=require('../backend/routes/index');
const multer= require('multer');

const axios = require("axios");
const api = require('../backend/routes/python')
const cors = require('cors')

app.set('view engine', 'ejs');
app.use(cors({
    origin: 'http://localhost:5173',// Your React App's URL
    methods: ['GET','POST'],
    credentials: true
}));
app.use(express.json());
// Set the directory for your view files (optional, 'views' is the default)
app.set('views', path.join(__dirname, 'views'));


app.use('/',us)
app.use('/api',api)

app.listen(port,()=>{
    console.log("server is started$",port)

})