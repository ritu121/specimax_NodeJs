const express = require('express');
const controller = require('../../controllers/risk.assessment.choice.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/:choiceId')
  .get(authorize(ADMIN_USER), controller.get)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

router
  .route('/options/:choiceId')
  .get(authorize(ADMIN_USER), controller.options)

module.exports = router;
