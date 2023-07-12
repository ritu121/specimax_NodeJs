const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/report.controller');
const { authorize, ADMIN, LOGGED_USER, USER } = require('../../../middlewares/auth');
const {
  listReports,
  createReport,
  replaceReport,
  updateReport,
} = require('../../../validations/report.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('reportId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listReports), controller.listReport)
  .post(authorize(USER), validate(createReport), controller.create);

router
  .route('/types')
  .get(authorize(USER), validate(listReports), controller.availableReport);

router
  .route('/export')
  .get(authorize(USER), validate(listReports), controller.download)

router
  .route('/:reportId')
  .get(authorize(USER), controller.get)
  .put(authorize(USER), validate(replaceReport), controller.replace)
  .patch(authorize(USER), validate(updateReport), controller.update)
  .delete(authorize(USER), controller.remove);

module.exports = router;
