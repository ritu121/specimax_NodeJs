const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/emergency.procedure.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(authorize(), controller.get)

module.exports = router;