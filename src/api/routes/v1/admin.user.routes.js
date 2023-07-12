const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin.user.controller');
const { authorize, ADMIN, LOGGED_USER , ADMIN_USER} = require('../../middlewares/auth');
const router = express.Router();

router.param('userId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/:userId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), controller.replace)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/change-status/:userId')
  .put(authorize(ADMIN_USER), controller.status)
module.exports = router;
