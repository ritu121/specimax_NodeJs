const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/report.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const {
  listReports,
  createReport,
  replaceReport,
  updateReport,
} = require('../../validations/report.validation');

const router = express.Router();
router.param('reportId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listReports), controller.list)
  .post(authorize(ADMIN_USER), validate(createReport), controller.create);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:reportId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceReport), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateReport), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/fetch/file')
  .get(authorize(ADMIN_USER), controller.filterReport);

router
  .route('/get/file')
  .get(authorize(ADMIN_USER), controller.getReportsWithToken);

router
  .route('/custom/report')
  .get(authorize(ADMIN_USER), controller.customReport);

router
  .route('/export/report')
  .get(authorize(ADMIN_USER), controller.exportfilterReport);

router
  .route('/export/reportwithtoken')
  .get(authorize(ADMIN_USER), controller.exportReportsWithToken);

module.exports = router;
