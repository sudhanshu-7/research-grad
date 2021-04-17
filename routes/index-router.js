const express = require('express');
const router = express.Router();
const userRouter = require('./user-router');


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

router.post("/register", (req, res) => {
    userRouter.createUser(req, res);
});

router.post("/login", (req, res, next) => {
    userRouter.loginUser(req, res, next);
})

module.exports = router;