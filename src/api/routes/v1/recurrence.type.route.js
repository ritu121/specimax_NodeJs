const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/recurrence.type.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const {
  listTips,
  createTip,
  replaceTip,
  updateTip,
} = require('../../validations/safety.tip.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('recurrenceId', controller.load);

router
  .route('/')
  
  .get(authorize(ADMIN_USER), controller.list)
  
  .post(authorize(ADMIN_USER), validate(createTip), controller.create);


router
  .route('/:tipId')
  
  .get(authorize(LOGGED_USER), controller.get)
  
//   .put(authorize(LOGGED_USER), validate(replaceTip), controller.replace)
  
  
//   .patch(authorize(LOGGED_USER), validate(updateTip), controller.update)
  
//   .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
