const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.support.message.controller');
const { authorize, ADMIN, USER } = require('../../../middlewares/auth');
const {
  listMessages,
  createMessage,
  replaceMessage,
  updateMessage,
} = require('../../../validations/user/support.message.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
// router.param('messageId', controller.load);
router
  .route('/')
  .post(authorize(USER), validate(createMessage), controller.create)

router
  .route('/:messageId')
  .get(authorize(USER), controller.get)
  .patch(authorize(USER), validate(updateMessage), controller.update)
  .put(authorize(USER), validate(replaceMessage), controller.replace)
  .delete(authorize(USER), controller.remove);

router
  .route('/list/:messageId')
  .get(authorize(USER), validate(listMessages), controller.list);

router
  .route('/view/:messageId')
  .get(authorize(USER), controller.view);
  
module.exports = router;
