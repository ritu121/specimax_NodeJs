const express = require('express');
const controller = require('../../controllers/home.controller');
const { authorize, ADMIN, LOGGED_USER,USER } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(authorize(USER),  controller.cities)

router
  .route('/getdates')
  .get(authorize(USER), controller.getdates)

router
  .route('/panic')
  .get(authorize(USER),  controller.panic)

module.exports = router;
