const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/timesheet.controller');
const { authorize, ADMIN, ADMIN_USER } = require('../../middlewares/auth');
const {
  listTimesheets,
  createTimesheet,
  replaceTimesheet,
  updateTimesheet,
} = require('../../validations/timesheet.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('timesheetId', controller.load);

router
  .route('/')
  .get(authorize(), validate(listTimesheets), controller.getTimeSheet)
  .post(authorize(), validate(createTimesheet), controller.create);

router.route('/getData').post(authorize(), validate(listTimesheets), controller.getTimeSheet)
router.route('/download/:timesheet').get(authorize(), controller.downloadTimesheet);
router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

  router.route('/getsites')
  .get(authorize(),controller.getUserSites)
  router.route('/getclient')
  .get(authorize(),controller.getClients)
  router.route('/getemployer')
  .get(authorize(),controller.getEmployer)

router
  .route('/:timesheetId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceTimesheet), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateTimesheet), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
