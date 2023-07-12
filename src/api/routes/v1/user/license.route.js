const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.licence.controller');
const { authorize, ADMIN, USER, LOGGED_USER } = require('../../../middlewares/auth');
const {
  listLicenses,
  createLicense,
  replaceLicense,
  updateLicense,
} = require('../../../validations/user/license.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('licenseId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listLicenses), controller.list)
  .post(authorize(USER), validate(createLicense), controller.create);

router
  .route('/download/:licenseId')
  .get(authorize(USER), controller.download)
router
  .route('/:licenseId')
  .get(authorize(USER), controller.get)
  .patch(authorize(USER), validate(updateLicense), controller.update)
  .put(authorize(USER), validate(replaceLicense), controller.replace)
  .delete(authorize(USER), controller.remove);
  
module.exports = router;
