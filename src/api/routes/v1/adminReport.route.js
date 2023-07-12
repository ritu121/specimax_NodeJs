const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/report.controller');
const { authorize, ADMIN, LOGGED_USER, ADMIN_USER } = require('../../middlewares/auth');
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
  
  .get(authorize(ADMIN_USER), validate(listReports), controller.list)

router
  .route('/portfolio')
  .get(authorize(ADMIN_USER), validate(listReports), controller.portfolioReports)

router
  .route('/admin/portfolio')
  .get(authorize(ADMIN_USER), controller.adminportfolioReports)

router
  .route('/portfolio/custom-reports')
  .get(authorize(ADMIN_USER), controller.customReports)

router
  .route('/admin/casual-shift')
  .get(authorize(ADMIN_USER), controller.adminCasualShiftReports)

  router
  .route('/export/portfolio')
  .get(controller.exportReportsIntoCsv)
  
module.exports = router;
