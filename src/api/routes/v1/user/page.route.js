const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/page.controller');
const { authorize, ADMIN,USER, LOGGED_USER } = require('../../../middlewares/auth');
const {
  listPages,
//   identifyPage
} = require('../../../validations/page.validation');

const router = express.Router();

// router.param('pageId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listPages), controller.list)

router
  .route('/:pageId')
  .get(authorize(USER), controller.findPage)

module.exports = router;
