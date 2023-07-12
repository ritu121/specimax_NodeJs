const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/shift.logs.controller');
const { authorize, ADMIN, ADMIN_USER } = require('../../middlewares/auth');
const {
  listLogs,
  createLogs,
  replaceLogs,
  updateLogs
} = require('../../validations/shift.logs.validation');

const router = express.Router();

router.param('shiftId', controller.load);

router
  .route('/')
  .get(authorize(), controller.list)
  .post(authorize(), validate(createLogs), controller.create);
router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:shiftId')
  .get(authorize(), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceLogs), controller.replace)
  .patch(authorize(), validate(updateLogs), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/fetch/file')
  .get(authorize(), controller.filterShiftLogs);

router
  .route('/export/file')
  .get(authorize(), controller.exportShiftLogs);

module.exports = router;
