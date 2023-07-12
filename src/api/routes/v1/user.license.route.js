const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.license.controller');
const { authorize, USER } = require('../../middlewares/auth');


const router = express.Router();

router
  .route('/download/:licenseId')
  .get(authorize(USER), controller.download)



module.exports = router;
