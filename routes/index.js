var express = require('express');
var logger = require('../middleware/logger.js');

var router = express.Router();


router.get('/setlanguage/:lang', function(req, res, next){
  logger.debug("lang: " + req.params.lang);
  logger.info("ckf 123");
  req.i18n.setLocale(req.params.lang);

  // or set it via the cookie
  res.cookie('locale', req.params.lang);
  req.i18n.setLocaleFromCookie();

  res.redirect('back');
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.i18n.__('Express') });
});

var affpayoutController = require('../controllers/affpayoutcontroller.js');
router.get('/affpayout', authenticateOrNot, affpayoutController.index);

module.exports = router;

function authenticateOrNot(req, res, next){
  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
}
