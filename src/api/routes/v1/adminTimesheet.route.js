const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/timesheet.controller');
const { authorize, ADMIN, LOGGED_USER,ADMIN_USER } = require('../../middlewares/auth');
const { handlePermission } = require('../../middlewares/permissions');
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
  .get(authorize(ADMIN_USER),  validate(listTimesheets), controller.list)

// router.route('/getData').post(authorize(), validate(listTimesheets), controller.getTimeSheet)
router.route('/download/:timesheet').get(authorize(), controller.downloadTimesheet);


  router.route('/getsites')
  .get(authorize(),controller.getUserSites)
  router.route('/getclient')
  .get(authorize(),controller.getClients)
  router.route('/getemployer')
  .get(authorize(),controller.getEmployer)

router
  .route('/:timesheetId')
  .get(authorize(ADMIN_USER), controller.get)

//   .put(authorize(LOGGED_USER), validate(replaceTimesheet), controller.replace)
  .patch(authorize(ADMIN_USER), controller.update);


router
  .route('/change-status/:timesheetId') 
  .patch(authorize(ADMIN_USER), controller.updateStatus);


module.exports = router;
