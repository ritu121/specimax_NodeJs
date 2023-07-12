const express = require('express');
const validate = require('express-validation');
const companyController = require('../../../controllers/company/casual.shift.controller');
const { authorize, USER } = require('../../../middlewares/auth');
const {
  listShifts,
  createShift,
  replaceShift,
  updateShift,
} = require('../../../validations/user/shift.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('shiftId', companyController.load);

router
  .route('/')
  .get(authorize(USER), validate(listShifts), companyController.listUser)
//   .post(authorize(USER), validate(createShift), controller.create);


router
    .route('/cancel-subscription')
    .post(authorize(USER),companyController.cancelIntrest)
  router
    .route('/release-shift')
    .post(authorize(USER),companyController.releaseShift)

router
  .route('/:shiftId')
  .get(authorize(USER), companyController.get)
  .post(authorize(USER), companyController.updateIntrest)
  
  
module.exports = router;
