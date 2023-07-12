const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/license.type.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listType,
  createType,
  replaceType,
  updateType
} = require('../../validations/license.type.validation');

const router = express.Router();

router.param('typeId', controller.load);

router
  .route('/')
  .get( controller.list)
  .post(controller.create);

router
  .route('/:typeId')
  .get(authorize(LOGGED_USER), controller.get)
  .patch(authorize(LOGGED_USER), controller.update)
  .delete(authorize(LOGGED_USER), controller.remove)
  
module.exports = router;
