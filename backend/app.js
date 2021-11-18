require('dotenv').config();
const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieSession = require("cookie-session");
const passportSetup = require("./src/config/passport");
const cors = require('cors');
const multer = require("multer");
const mysql = require("mysql");
const config = require("./src/config/db");

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const announcRoutes = require('./src/routes/announcementRoutes');
const groupRoutes = require('./src/routes/groupRoutes');


const app = express();

// ============ Middleware ============
//cookie
app.use(cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [process.env.COOKIEKEY]
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//initialize passportt for se/deserialization
app.use(passport.initialize());

//session
app.use(passport.session());

// app.use(cors);

// ============ Routes ============
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/announc", announcRoutes);
app.use("/group", groupRoutes);



// ============ Starting server ============
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log("Server is starting at port " + PORT)
})







