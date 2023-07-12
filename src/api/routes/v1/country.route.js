const express = require('express');
const validate = require('express-validation');
const Country = require('../../models/country.model');
// eslint-disable-next-line import/no-unresolved
const controller = require('../../controllers/all/country.controller');
const {
  listCounties,
} = require('../../validations/country.validaton');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('countryId', controller.load);

router
  .route('/')
  .get(async(req, res) => {
    let countries = await Country.find({}).sort({'name':1});
    res.json({ code: 200, message: 'Country list retrieved successfully.', data: countries });
  });

module.exports = router;
