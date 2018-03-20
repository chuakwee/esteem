var affpayoutController = require('../controllers/affpayoutcontroller.js');

module.exports = function(app) {
    app.get('/affpayout', affpayoutController.index);
  }
