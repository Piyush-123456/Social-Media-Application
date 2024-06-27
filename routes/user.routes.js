var express = require('express');
var router = express.Router();
const { isLoggedIn } = require("../middleware/auth")
const passport = require("passport");
const LocalStategy = require("passport-local");
const path = require("path");
const imagekit = require("../utils/imagekit");
const userCollection = require("../models/userschema");
const { sendMail } = require("../utils/nodemailer");
passport.use(new LocalStategy(userCollection.authenticate()));


router.post("/register", async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        await userCollection.register({ username, email }, password);
        res.redirect("/login");
    }
    catch (err) {
        console.log(err);
    }
})


router.post("/login", passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/login",
}), (req, res, next) => {

})

router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("profile", { user: req.user });
});

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logout(() => {
        res.redirect("/login");
    })
});



router.post("/send-mail", async (req, res, next) => {
    try {
        const user = await userCollection.findOne({ email: req.body.email });
        console.log(user);
        if (!user)
            return res.send(
                "No user found with this email. <a href='/forget-email'>Try Again</a>"
            );

        await sendMail(req, res, user);
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.post("/verify-otp/:id", async (req, res, next) => {
    try {
        const user = await userCollection.findById(req.params.id);
        if (!user) {
            return res.send("Invalid User !");
        }
        if (user.otp != req.body.otp) {
            user.otp = 0;
            return res.send("Invalid OPT <a href=`${forget-email}`>Try Again</a>")
        }
        user.otp = 0;
        await user.setPassword(req.body.password);
        await user.save();
        res.redirect("/login");
    }
    catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
})


router.get("/settings", (req, res, next) => {
    res.render("settings", { user: req.user });
})


router.post("/avatar/:id", async (req, res, next) => {
    try {
        const result = await imagekit.upload({
            file: req.files.image.data,
            fileName: req.files.image.name
        })
        console.log(result);
        res.redirect("/user/settings");
    }
    catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
})
module.exports = router;
