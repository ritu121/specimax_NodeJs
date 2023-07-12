const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/all/site.controller');
const router = express.Router();


router
  .route('/:companyId')
  .get(controller.listByCountry)

module.exports = router;