const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/all/user.controller');
const router = express.Router();


router
  .route('/:siteId')
  .get(controller.listBySite)

module.exports = router;