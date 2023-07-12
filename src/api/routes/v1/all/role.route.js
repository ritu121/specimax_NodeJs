const express = require('express');
const validate = require('express-validation');
const Role = require('../../../models/role.model');
// eslint-disable-next-line import/no-unresolved
const {
  listRoles,
} = require('../../../validations/all/role.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */

router
  .route('/')
  .get(validate(listRoles), (req, res) => {
    Role.find({}, (err, companies) => {
      res.json({ code: 200, message: 'Company role list retrieved successfully.', data: companies });
    });
  });

module.exports = router;
