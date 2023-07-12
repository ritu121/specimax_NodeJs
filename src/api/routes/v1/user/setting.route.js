const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.setting.controller');
const { authorize, USER } = require('../../../middlewares/auth');
const {
  getSetting,
  updateSetting,
} = require('../../../validations/user/setting.validation');

const router = express.Router();

router
  .route('/')
  .get(authorize(USER), validate(getSetting), controller.get)
  .patch(authorize(USER), validate(updateSetting), controller.update)
module.exports = router;
