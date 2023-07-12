const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/admin.modules.controller');
const { authorize, ADMIN, LOGGED_USER , ADMIN_USER} = require('../../middlewares/auth');
const {
  listReports,
  createReport,
  replaceReport,
  updateReport,
} = require('../../validations/report.validation');

const router = express.Router();

router.param('moduleId', controller.load);

router
  .route('/')
  
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create)
  
module.exports = router;