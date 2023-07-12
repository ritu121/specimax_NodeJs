const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/admin/guards.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');


const router = express.Router();


router
  .route('/')
  .get(authorize(ADMIN_USER), controller.getTeam)


module.exports = router;
