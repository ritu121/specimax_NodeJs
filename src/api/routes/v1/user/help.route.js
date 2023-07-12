const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/help.controller');
const { authorize, ADMIN,USER, LOGGED_USER } = require('../../../middlewares/auth');
const {
  listHelps,
} = require('../../../validations/help.validation');

const router = express.Router();

router.param('helpId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listHelps), controller.list)


router
  .route('/:helpId')
  .get(authorize(USER), controller.get)
module.exports = router;
