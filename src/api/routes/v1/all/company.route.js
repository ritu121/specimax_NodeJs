const express = require('express');
const validate = require('express-validation');
const Company = require('../../../models/company.model');
// eslint-disable-next-line import/no-unresolved
const controller = require('../../../controllers/all/company.controller');
const {
  listCompanies,
} = require('../../../validations/all/company.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('countryId', controller.load);

router
  .route('/')
  .get(validate(listCompanies), (req, res) => {
    Company.find({}, (err, companies) => {
      res.json({ code: 200, message: 'Company list retrieved successfully.', data: companies });
    });
  });

module.exports = router;
