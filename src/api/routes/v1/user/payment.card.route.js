const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.card.controller');
const { authorize, USER } = require('../../../middlewares/auth');
const {
  listCards,
  createCard,
  replaceCard,
  updateCard,
} = require('../../../validations/user/user.card.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('cardId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listCards), controller.list)
  .post(authorize(USER), validate(createCard), controller.create);

router
  .route('/outgoing')
  .get(authorize(USER), validate(listCards), controller.getOutgoingCards)
  
router
  .route('/:cardId')
  .get(authorize(USER), controller.get)
  .patch(authorize(USER), validate(replaceCard), controller.update)
  .put(authorize(USER), validate(updateCard), controller.replace)
  .delete(authorize(USER), controller.remove);
  
module.exports = router;
