require('dotenv').config();
const express = require("express");
const path = require('path');
const multer = require("multer");
const mysql = require("mysql");
const config = require("./src/config/db");


const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// ============ Middleware ============
app.use(express.static(path.join(__dirname, 'public')));

// ============ Routes ============
app.use("/user",userRoutes);


// ============ Starting server ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is starting at port " + PORT)
})







