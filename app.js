require("dotenv").config({ path: "./.env" });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const userCollection = require("./models/userschema");
var indexRouter = require('./routes/index.routes');
var usersRouter = require('./routes/user.routes');
var postsRouter = require('./routes/post.routes');


const fileUpload = require('express-fileupload')
require('./models/dbconnection').connectDB();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(
  session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userCollection.serializeUser());
passport.deserializeUser(userCollection.deserializeUser());


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/post',postsRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
