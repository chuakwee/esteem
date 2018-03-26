var mysql = require('../middleware/db.js');

exports.index = function(req, res, next) {
  console.log("zz");
  req.flash('info', 'Welcome');
  mysql.query('SELECT id, currencycode FROM currency order by currencycode ').then(function(rows){
    console.log("ckf: " + rows[0].currencycode);
    res.render('../views/affpayout/index', { 'title': req.i18n.__('Affiliate Payout Report'),'currencylist': rows });
  });
}
