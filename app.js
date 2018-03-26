var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('express-flash');

var index = require('./routes/index');

var config = require('./config/config.js').get(process.env.NODE_ENV);

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash()); // flash must be used after cookie and session

var session_configuration = {
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true
};

app.use(session(session_configuration));
app.use(passport.initialize());
app.use(passport.session());

// add i18n config after app used the cookieParser
var i18n = require('i18n-2');

// Attach the i18n property to the express request object
// And attach helper methods for use in templates
i18n.expressBind(app, {
    // setup some locales - other locales default to en silently
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    // change the cookie name from 'lang' to 'locale'
    cookieName: 'locale'
});

// This is how you'd set a locale from req.cookies.
// Don't forget to set the cookie either on the client or in your Express app.

app.use(function(req, res, next) {
  req.i18n.setLocaleFromQuery();
  req.i18n.setLocaleFromCookie();
  //console.log("pp: " + req.params.lang + " pp2: " + req.cookies.locale);
  next();
});
/*
app.use(function(req, res, next) {
  console.log("ppq: ");
    // express helper for natively supported engines
    res.locals.__ = res.__ = function() {
        return i18n.__.apply(req, arguments);
    };

    next();
});
*/
// view engine setup. The view engine must be put after i18n config so that the templates can see the translations
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', index);
var authRoute = require('./routes/auth.js')(app,passport);

// load passport strategies
require('./middleware/passport.js')(passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
