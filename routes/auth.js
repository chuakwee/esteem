module.exports = function(app, passport){
  app.get('/login', function(req, res){
    res.render('../views/login/index', {'message': req.flash('message')});
  });

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/affpayout',
    failureRedirect: '/login',
    successFlash: { message: "Welcome Back" },
    failureFlash: { type: 'message' }, // cannot put true here, as it will not show error message if username or password is empty. The strategy function will never get called if username or password are empty, in which case Passport will immediately redirect to failureRedirect.
    badRequestMessage: 'Username and Password cannot be empty'
  }));

  app.get('/logout', function(req, res){
    req.session.destroy(function(err){
      res.redirect('/login');
    })});

}
