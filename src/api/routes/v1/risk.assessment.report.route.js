const express = require('express');
const validate = require('express-validation');
const reportController = require('../../controllers/risk.assessment.report.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/')
  .get(authorize(ADMIN_USER), reportController.list)
  .post(authorize(ADMIN_USER), reportController.create);
router
.route('/export')
  .get(authorize(ADMIN_USER), reportController.exportRiskAssessment)
router
  .route('/:reportId')
  .get(authorize(ADMIN_USER), reportController.get)
  .patch(authorize(ADMIN_USER), reportController.update)
  .delete(authorize(ADMIN_USER), reportController.remove);

module.exports = router;
