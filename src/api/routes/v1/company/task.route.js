const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/company/task.controller');
const { authorize, ADMIN , ADMIN_USER} = require('../../../middlewares/jwt');
const {
  listTasks,
  createTask,
  replaceTask,
  updateTask,
} = require('../../../validations/company/task.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('taskId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listTasks), controller.list)
  .post(authorize(ADMIN_USER), validate(createTask), controller.create);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:taskId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceTask), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateTask), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
