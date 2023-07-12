const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.gps.setting.controller');
const { authorize, USER } = require('../../../middlewares/auth');
const {
  getGpsSetting,
  updateGpsSetting,
} = require('../../../validations/user/gps.setting.validation');

const router = express.Router();

router
  .route('/')
  .get(authorize(USER), validate(getGpsSetting), controller.get)
  .patch(authorize(USER), validate(updateGpsSetting), controller.update);
module.exports = router;
