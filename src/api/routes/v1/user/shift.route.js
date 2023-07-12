const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.shift.controller');
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
router.param('shiftId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listShifts), controller.list)
  .post(authorize(USER), validate(createShift), controller.create);

router
  .route('/list')
  .get(authorize(USER),  controller.listApplied)

router
  .route('/resendshiftcode/:shiftId')
  .get(authorize(USER),controller.resendShiftCode)

router
  .route('/clockin/:shiftId')
  .patch(authorize(USER),controller.clockIn)

router
  .route('/clockout/:shiftId')
  .patch(authorize(USER),controller.clockOut)

router
  .route('/verifyshiftcode/:shiftId')
  .get(authorize(USER),controller.verifyShiftCode)

router
  .route('/addbreak/:shiftId')
  .patch(authorize(USER),controller.addBreak)

router
  .route('/apply/:shiftId')
  .patch(authorize(USER), controller.apply)

router
  .route('/:shiftId')
  .get(authorize(USER), controller.get)
  .patch(authorize(USER), validate(replaceShift), controller.update)
  .put(authorize(USER), validate(updateShift), controller.replace)
  .delete(authorize(USER), controller.remove);
  
module.exports = router;
