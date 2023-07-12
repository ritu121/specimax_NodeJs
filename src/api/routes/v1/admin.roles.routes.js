const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/admin.roles.controller');
const { authorize, ADMIN, LOGGED_USER, ADMIN_USER } = require('../../middlewares/auth');
const {
  listReports,
  createReport,
  replaceReport,
  updateReport,
} = require('../../validations/report.validation');

const router = express.Router();

router.param('roleId', controller.load);

router
  .route('/')
  
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create)

router
  .route('/:roleId')
  .get(authorize(ADMIN_USER), controller.get)
//   .put(authorize(ADMIN), controller.replace)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);
  
module.exports = router;