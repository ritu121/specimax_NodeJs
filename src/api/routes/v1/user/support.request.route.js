const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/support.controller');
const { authorize, ADMIN,USER, LOGGED_USER } = require('../../../middlewares/auth');
const {
  listSupports,
  createSupport,
  replaceSupport,
  updateSupport,
  listForUser,
  createUserSupport,
  updateUserSupport
} = require('../../../validations/support.validation');

const router = express.Router();

router.param('supportId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listSupports), controller.listForUser)
  .post(authorize(USER), validate(createUserSupport), controller.createRequestForUser);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:supportId')
  .get(authorize(USER), controller.get)
//   .put(authorize(LOGGED_USER), validate(replaceSupport), controller.replace)
  .patch(authorize(USER), validate(updateUserSupport), controller.updateRequestForUser)
  .delete(authorize(USER), controller.remove);

module.exports = router;
