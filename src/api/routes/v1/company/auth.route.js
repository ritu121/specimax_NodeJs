const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/company/auth.controller');

const {
  login,
} = require('../../../validations/company/auth.validation');

const router = express.Router();


router.route('/login')
  .post(validate(login), controller.login);

router.route('/login/otp')
  .post(controller.otp);

module.exports = router;
