const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.task.controller');
const { authorize, USER } = require('../../../middlewares/jwt');
const {
  listTasks,
  createTask,
  replaceTask,
  updateTask,
  updateStatus
} = require('../../../validations/user/task.validation');

const router = express.Router();

router.param('taskId', controller.load);

router
  .route('/')
  .get(authorize(USER), controller.list) 



router
  .route('/:taskId')
  .get(authorize(USER), controller.get)
  .patch(authorize(USER), controller.updateStatus)



module.exports = router;
