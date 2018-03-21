var crypto   = require('crypto');
var mysql = require('./db.js');

module.exports = (passport) => {

  var LocalStrategy = require('passport-local').Strategy;

  //passport Strategy -- the express session middleware before calling passport.session()
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //passback entire req to call back
  } , function (req, username, password, done){
        if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }

        mysql.query("select id, username, salt, password from sf_guard_user where username = ?", [username]).then( rows => {
          console.log("ckf: " + rows[0].username);
          //console.log(err);
          //if (err) return done(req.flash('message',err));

          var salt = rows[0].salt;

          if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
          salt = salt+''+password;
          var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
          var dbPassword  = rows[0].password;

          if(!(dbPassword == encPassword)){
              return done(null, false, req.flash('message','Invalid username or password.'));
           }

          return done(null, rows[0]);
        });
      }
  ));

  passport.serializeUser(function(user, done){
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    mysql.query("select * from sf_guard_user where id = ?", [id]).then(rows => {
      done(null, rows[0]);
    });
  });
}
