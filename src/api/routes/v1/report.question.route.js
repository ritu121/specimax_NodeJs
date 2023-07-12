const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/report.question.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const {
  listQuestions,
  createQuestion,
  replaceQuestion,
  updateQuestion,
} = require('../../validations/report.question.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('questionId', controller.load);

router
  .route('/')
  .get(validate(listQuestions), controller.list)
  .post(authorize(ADMIN_USER), validate(createQuestion), controller.create);


router
  .route('/:questionId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceQuestion), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateQuestion), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
