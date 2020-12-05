var express = require('express');
var router = express.Router();
const {scrapeKijiji} = require("../public/javascripts/scraper.js");

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log("got it");
  let result = await scrapeKijiji();
  console.log(result);
  res.status(200).json(result);
  //res.render('index', { title: 'Express' });
});

module.exports = router;
