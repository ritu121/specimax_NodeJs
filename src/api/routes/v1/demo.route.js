const express = require('express');
const controller = require('../../controllers/demo.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');


const router = express.Router();

router
  .route('/')
  .get(authorize(ADMIN_USER),controller.removePermissions);

module.exports = router;
