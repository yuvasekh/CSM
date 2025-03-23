const express = require("express");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ limit: "450mb" });
const axios = require("axios");
var router = express.Router();
var multer = require("multer");
require("dotenv").config();
const upload = multer();

router.use(upload.any(), jsonParser, (req, res, next) => {
  return next();
});
// require("./login.router")(router);

module.exports = router;
