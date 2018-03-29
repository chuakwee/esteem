var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var fs = require('fs');
var rfs = require('rotating-file-stream');
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

var logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

app.use(morgan('combined', {stream: accessLogStream})); // morgan need to be used before all the routes

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

  next();
});

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

var winston = require('./middleware/logger.js');
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
