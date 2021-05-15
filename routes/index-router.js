const express = require('express');
const router = express.Router();
const userRouter = require('./user-router');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');


router.get("/", (req, res) => {
    res.render("index");
})

router.get("/about", (req, res) => {
    res.render("about");
})

router.get("/login", (req, res) => {
    res.render("login", {incorrect: false});
})

router.get("/signup", (req, res) => {
    res.render("signup");
})

router.get("/profile", ensureAuthenticated, (req, res) => {
    userRouter.profile(req, res);
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out!');
    res.redirect("/login");
})

router.get("/blog",ensureAuthenticated, (req, res) => {
    userRouter.blog(req, res);
})

router.post("/register", (req, res) => {
    userRouter.createUser(req, res);
});

router.post("/login", (req, res, next) => {
    userRouter.loginUser(req, res, next);
})

router.post("/profile", (req, res) => {
    userRouter.editProfile(req, res);
})

router.post("/blog", (req, res) => {
    userRouter.postBlog(req, res);
})

router.post("/blog/:id", (req, res) => {
    userRouter.editBlog(req, res);
})

router.get("/auth/google", passport.authenticate('google', { scope: ['profile'] }));

router.get(
    '/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }), 
    (req, res) => {
        res.redirect('/profile');
    }
);

module.exports = router;