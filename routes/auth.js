module.exports = function(app, passport){
  app.get('/login', function(req, res){
    res.render('../views/login/index', {'message': req.flash('message')});
  });

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/affpayout',
    failureRedirect: '/login',
    successFlash: { message: "Welcome Back" },
    failureFlash: true
  }));

  app.get('/logout', function(req, res){
    req.session.destroy(function(err){
      res.redirect('/');
    })});

}
