var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	if (req.isAuthenticated()) {
		res.render('index', { title: 'Express' });
	} else {
		res.redirect('/new_login')
	}
  
});

module.exports = router;
