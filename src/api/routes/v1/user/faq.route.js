const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/faq.controller');
const { authorize, ADMIN,USER, LOGGED_USER } = require('../../../middlewares/auth');
const {
  listFaqs,
  createFaq,
  replaceFaq,
  updateFaq,
} = require('../../../validations/faq.validation');

const router = express.Router();

router.param('faqId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listFaqs), controller.list)
  .post(authorize(USER), validate(createFaq), controller.create);

router
  .route('/faq')
  .get(authorize(), controller.loggedIn);

router
  .route('/:faqId')
  .get(authorize(USER), controller.get)
  .put(authorize(USER), validate(replaceFaq), controller.replace)
  .patch(authorize(USER), validate(updateFaq), controller.update)
  .delete(authorize(USER), controller.remove);

module.exports = router;
