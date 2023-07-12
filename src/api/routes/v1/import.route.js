const express = require('express');
const controller = require('../../controllers/import.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');


const router = express.Router();



router
  .route('/')
  .get(authorize(ADMIN_USER),  controller.cities)

module.exports = router;
