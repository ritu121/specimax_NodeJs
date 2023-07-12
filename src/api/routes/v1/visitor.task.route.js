const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/visitor.task.controller');
const { authorize, ADMIN, ADMIN_USER } = require('../../middlewares/visitor-auth');
const {
  listTasks,
  createTask,
  replaceTask,
  updateTask,
} = require('../../validations/task.validation');

const router = express.Router();

router.param('taskId', controller.load);

router
  .route('/')
  .get(authorize(), validate(listTasks), controller.list)
  .post(authorize(ADMIN_USER), validate(createTask), controller.create);

// router
//   .route('/profile')
//   .get(authorize(), controller.loggedIn);

router
  .route('/report')
  .get(authorize(), validate(listTasks), controller.listTask)

router
  .route('/list')
  .get(authorize(), validate(listTasks), controller.visitorList)


router
  .route('/:taskId')
  .get(authorize(ADMIN_USER), controller.get)
  // .put(authorize(ADMIN_USER), validate(replaceTask), controller.replace)
  .patch(authorize(ADMIN_USER), controller.updateStatus)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/group-by-id/:groupId')
  .get(authorize(ADMIN_USER),controller.listGroup);

router
  .route('/change-status/:taskId')
  .patch(authorize(ADMIN_USER), controller.status);

module.exports = router;
