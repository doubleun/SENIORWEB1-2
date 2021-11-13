require('dotenv').config();
const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const multer = require("multer");
const mysql = require("mysql");
const config = require("./src/config/db");
var _ = require('lodash');


const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// ============ Middleware ============
app.use(express.static(path.join(__dirname, 'backend')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
// enable files upload

app.use(fileUpload({
    createParentPath: true
}));
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));



// ============ Routes ============
app.use("/user",userRoutes);



// ============ Starting server ============
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log("Server is starting at port " + PORT)
})







