const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/alarm.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const {
  listReports,
  createReport,
  replaceReport,
  updateReport,
} = require('../../validations/report.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('reportId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create)


router
  .route('/report')
  .get(authorize(ADMIN_USER), controller.listReport)


router
  .route('/:alarmId')
  .put(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove)
  
  
module.exports = router;
