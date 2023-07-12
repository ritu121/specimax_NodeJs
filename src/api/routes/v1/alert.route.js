const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/alert.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
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
router.param('tipId', controller.load);

router
  .route('/')
  
  .get(authorize(ADMIN_USER), controller.list)
  
  .post(authorize(ADMIN_USER), validate(createTip), controller.create);


router
  .route('/:tipId')
  
  .get(authorize(ADMIN_USER), controller.get)
  
  .put(authorize(ADMIN_USER), validate(replaceTip), controller.replace)
  
  
  .patch(authorize(ADMIN_USER), validate(updateTip), controller.update)
  
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
