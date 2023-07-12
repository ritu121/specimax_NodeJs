const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/userCv.controller');
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
// router.param('licenseId', controller.load);

router
  .route('/')
  .get(authorize(USER), controller.getData)
router
  .route('/all')
  .get(controller.getAllData)
//   .post(authorize(USER), validate(createLicense), controller.create);
  
// router
//   .route('/:licenseId')
//   .get(authorize(USER), controller.get)
//   .patch(authorize(USER), validate(updateLicense), controller.update)
//   .put(authorize(USER), validate(replaceLicense), controller.replace)
//   .delete(authorize(USER), controller.remove);
  
module.exports = router;
