const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/admin.guards.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const { handlePermission } = require('../../middlewares/permissions');
// const {
//   listCompanies,
//   createCompany,
//   replaceCompany,
//   updateCompany,
// } = require('../../validations/company.user.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('companyId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:companyId')
  .put(authorize(ADMIN_USER), controller.replace)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

// router
//   .route('/by-company')
//   .post(authorize(ADMIN_USER), controller.users)


router
  .route('/change-status/:userId')
  .patch(authorize(ADMIN_USER), controller.changeStatus)

module.exports = router;
