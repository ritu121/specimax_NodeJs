const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/page.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const {
  listPages,
  createPage,
  replacePage,
  updatePage,
} = require('../../validations/page.validation');

const router = express.Router();

router.param('pageId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listPages), controller.list)
  .post(authorize(ADMIN_USER), validate(createPage), controller.create);

router
  .route('/page')
  .get(authorize(), controller.loggedIn);

router
  .route('/:pageId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replacePage), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updatePage), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
