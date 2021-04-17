const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

require('./config/passport')(passport);


const db = require('./db');
const userRouter = require('./routes/user-router');
const { user } = require("./db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

app.use('/', require('./routes/index-router.js'));

app.listen(4000, () => {
    console.log("Server up on port 4000");
})