const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/company-admin/auth.controller');

const {
  login,
} = require('../../../validations/company-admin/auth.validation');
const { isLoggedIn } = require('../../../middlewares/adminAuth');

const router = express.Router();

router.route('/login')
  .post(validate(login), controller.login);


module.exports = router;
