const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/faq.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const { handlePermission } = require('../../middlewares/permissions');
const {
  listFaqs,
  createFaq,
  replaceFaq,
  updateFaq,
} = require('../../validations/faq.validation');

const router = express.Router();

router.param('faqId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), handlePermission('6335dbe4d4d22b9159638bca'), validate(listFaqs), controller.list)
  .post(authorize(ADMIN_USER),handlePermission('6335dbe8d4d22b9159638bcd'), validate(createFaq), controller.create);

router
  .route('/privacy')
  .get(authorize(), controller.privacy)
  .post(authorize(), controller.createPrivacy)
router
  .route('/tnc')
  .get(authorize(), controller.tnc)
  .post(authorize(), controller.createTerms)
router.route('/privacy/:privacyId')
  .patch(authorize(ADMIN_USER), controller.updatePrivacy);

router
  .route('/faq')
  .get(authorize(), controller.loggedIn);

router
  .route('/:faqId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceFaq), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateFaq), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
