const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/liscense.controller');
const { authorize, ADMIN, USER, LOGGED_USER , ADMIN_USER} = require('../../middlewares/auth');
const {
  listLicenses,
  createLicense,
  replaceLicense,
  updateLicense,
} = require('../../validations/user/license.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('licenseId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), validate(createLicense), controller.createByUserid);

// router
//   .route('/download/:licenseId')
//   .get(authorize(USER), controller.download)
router
  .route('/:licenseId')
  .get(authorize(ADMIN_USER), controller.get)
  .patch(authorize(ADMIN_USER), validate(updateLicense), controller.update)
//   .put(authorize(USER), validate(replaceLicense), controller.replace)
  .delete(authorize(ADMIN_USER), controller.remove);
  
module.exports = router;
