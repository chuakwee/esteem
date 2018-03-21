var express = require('express');
var router = express.Router();

var affpayoutController = require('../controllers/affpayoutcontroller.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/affpayout', authenticateOrNot, affpayoutController.index);

module.exports = router;

function authenticateOrNot(req, res, next){
  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
}
