const express = require('express');
const validate = require('express-validation');
// eslint-disable-next-line import/no-unresolved
const controller = require('../../controllers/admin/admin.dashboard.controller');
const {
  listCounties,
} = require('../../validations/country.validaton');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const { handlePermission } = require('../../middlewares/permissions');


const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
// router.param('countryId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER),handlePermission('6335dc06d4d22b9159638bd6'),controller.adminDashboard);

module.exports = router;
