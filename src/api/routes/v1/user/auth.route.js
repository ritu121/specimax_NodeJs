const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.auth.controller');
const oAuthLogin = require('../../../middlewares/auth').oAuth;
const {
  login,
  register,
  oAuth,
  otp,
  refresh,
  sendPasswordReset,
  passwordReset,
  verifySignup
} = require('../../../validations/user.auth.validation');

const router = express.Router();

// router.route('/updateStripe')
//   .get(controller.updateStripe)

router.route('/register')
  .post(validate(register), controller.register);

router.route('/register/verify')
  .post(validate(verifySignup), controller.verifySignup);

router.route('/login')
  .post(validate(otp), controller.otp);

router.route('/login/otp')
  .post(validate(login), controller.login);

router.route('/refresh-token')
  .post(validate(refresh), controller.refresh);

router.route('/send-password-reset')
  .post(validate(sendPasswordReset), controller.sendPasswordReset);

router.route('/reset-password')
  .post(validate(passwordReset), controller.resetPassword);

router.route('/facebook')
  .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);

router.route('/google')
  .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);

module.exports = router;
