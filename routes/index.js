var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const d = new Date();
    d.toString();
  res.render('index', { title: 'RADIUSdesk API Gateway',time_now: d });
});

module.exports = router;
