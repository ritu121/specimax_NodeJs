const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/receipt.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listQuestions,
  createQuestion,
  replaceQuestion,
  updateQuestion,
} = require('../../validations/question.validation');

const router = express.Router();

router.route('/')
    .get(authorize(),controller.list)
    .post(authorize(),controller.createReceipt)
router.route('/getPdf')
    .get(authorize(),controller.getPdf)



module.exports = router;
