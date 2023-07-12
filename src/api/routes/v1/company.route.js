const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/company.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const { handlePermission } = require('../../middlewares/permissions');
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
  .get(authorize(ADMIN_USER), handlePermission('6335dc06d4d22b9159638bd6'), validate(listCompanies), controller.list)
  .post(authorize(ADMIN_USER), handlePermission('6335dc0bd4d22b9159638bd9'), validate(createCompany), controller.create);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router.route('/all')
  .get(authorize(ADMIN_USER),controller.listAll)

router
  .route('/:companyId')
  .get(authorize(ADMIN_USER), handlePermission('6335dc06d4d22b9159638bd6'),controller.get)
  .put(authorize(ADMIN_USER), validate(replaceCompany), controller.replace)
  .patch(authorize(ADMIN_USER),handlePermission('6335dc14d4d22b9159638bdc'), validate(updateCompany), controller.update)
  .delete(authorize(ADMIN_USER),handlePermission('6335dc1cd4d22b9159638bdf'), controller.remove);



module.exports = router;
