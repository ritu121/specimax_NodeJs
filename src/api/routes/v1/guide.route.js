const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/guide.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const {
  listHelps,
  createHelp,
  replaceHelp,
  updateHelp,
} = require('../../validations/help.validation');

const router = express.Router();

router.param('guideId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/user')
  .get( controller.list)

router
  .route('/:guideId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), controller.replace)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
