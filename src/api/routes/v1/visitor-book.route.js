const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/visitor-book.controller');
const { authorize, ADMIN, ADMIN_USER } = require('../../middlewares/visitor-auth');
const {
  listTasks,
  createTask,
  replaceTask,
  updateTask,
} = require('../../validations/task.validation');

const router = express.Router();

// router.param('taskId', controller.load);

router
  .route('/')
  .get(authorize(),  controller.list)
  .post(authorize(ADMIN_USER), controller.create);
router
  .route('/history')
  .get(authorize(),  controller.history)
router
  .route('/adddoc')
  .patch(authorize(), controller.addSites)
router
  .route('/updateinduction')
  .post(authorize(), controller.updateInduction)
router
  .route('/reason')
  .patch(authorize(), controller.updateReason)
router
  .route('/clockout')
  .post(authorize(), controller.clockOut)
// router
//   .route('/profile')
//   .get(authorize(), controller.loggedIn);

// router
//   .route('/list')
//   .get(authorize(), validate(listTasks), controller.visitorList)




module.exports = router;
