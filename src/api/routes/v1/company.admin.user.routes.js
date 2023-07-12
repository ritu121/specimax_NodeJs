const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/company.admin.user.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const {
  listCompanies,
  createCompany,
  replaceCompany,
  updateCompany,
} = require('../../validations/company.user.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('companyId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listCompanies), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:companyId')
  .get(authorize(ADMIN_USER), controller.get)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/by-company')
  .post(authorize(ADMIN_USER), controller.users)

router
  .route('/change-status/:userId')
  .put(authorize(ADMIN_USER), controller.status)

module.exports = router;
