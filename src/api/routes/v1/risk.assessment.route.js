const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/risk.assessment.category.controller');
const questionController = require('../../controllers/risk.assessment.question.controller');
const reportController = require('../../controllers/risk.assessment.report.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const {
  createRole,
  updateRole,
} = require('../../validations/role.validation');

const router = express.Router();

// router.param('roleId', controller.load);

// router
//   .route('/')
//   .get(authorize(ADMIN_USER), reportController.list)
//   .post(authorize(ADMIN_USER), reportController.create);

// router
//   .route('/:reportId')
//   .get(authorize(ADMIN_USER), reportController.get)
//   .patch(authorize(ADMIN_USER), reportController.update)
//   .delete(authorize(ADMIN_USER), reportController.remove);

router
  .route('/category')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/category/:categoryId')
  .get(authorize(ADMIN_USER), controller.get)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/category-question')
  .get(authorize(ADMIN_USER), questionController.list)
  .post(authorize(ADMIN_USER), questionController.create);

router
  .route('/category-question/:questionId')
  .get(authorize(ADMIN_USER), questionController.get)
  .patch(authorize(ADMIN_USER), questionController.update)
  .delete(authorize(ADMIN_USER), questionController.remove);

router
  .route('/category-question/by-category/:categoryId')
  .get(authorize(ADMIN_USER), questionController.getQuestionCategory)


module.exports = router;
