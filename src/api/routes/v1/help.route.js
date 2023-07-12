const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/help.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const {
  listHelps,
  createHelp,
  replaceHelp,
  updateHelp,
} = require('../../validations/help.validation');

const router = express.Router();

router.param('helpId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listHelps), controller.list)
  .post(authorize(ADMIN_USER), validate(createHelp), controller.create);

router
  .route('/help')
  .get(authorize(), controller.loggedIn);

router
  .route('/:helpId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceHelp), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateHelp), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
