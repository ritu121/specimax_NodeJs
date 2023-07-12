const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/city.controller');
const { authorize, ADMIN, ADMIN_USER } = require('../../middlewares/auth');
// const {
//   listCompanies,
//   createCompany,
//   replaceCompany,
//   updateCompany,
// } = require('../../validations/company.validation');

const router = express.Router();


router.param('cityId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/:cityId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), controller.replace)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/by-country/:cityId')
  .get(controller.cities);


module.exports = router;


module.exports = router;
