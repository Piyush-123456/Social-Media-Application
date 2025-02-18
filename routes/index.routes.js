var express = require('express');
var router = express.Router();

const PostCollection = require("../models/posts")
/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    var post = await PostCollection.find();
  }
  catch (err) {
    console.log(err.message);
  }
  res.render('home', { user: req.user, post: post });
});

router.get("/about", (req, res, next) => {
  res.render("about", { user: req.user });
})

router.get("/login", (req, res, next) => {
  if (req.user) {
    return res.redirect("/user/profile");
  }
  res.render("login", { user: req.user });
})

router.get("/forget", (req, res, next) => {
  res.render("forget", { user: req.user });
})

router.get("/register", (req, res, next) => {
  res.render("register", { user: req.user });
})

router.get("/forget-email", (req, res) => {
  res.render("forgetemail", {
    title: "Forgot Password  | SocialMedia",
    user: req.user,
  });
});

router.get("/verify-otp/:id", (req, res) => {
  res.render("forgetOTP", {
    title: "Verify OTP  | SocialMedia",
    user: req.user,
    id: req.params.id,
  });
});


module.exports = router;
