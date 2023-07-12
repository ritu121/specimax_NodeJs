const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/vendor.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const {
  listCompanies,
  createCompany,
  replaceCompany,
  updateCompany,
} = require('../../validations/company.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('companyId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listCompanies), controller.list)
  .post(authorize(ADMIN_USER), validate(createCompany), controller.create);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:companyId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceCompany), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateCompany), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
