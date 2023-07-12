const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/control.center.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

// router.param('shiftId', controller.load);

router
  .route('/:shiftId')
  .get(authorize(), controller.get)

module.exports = router;
