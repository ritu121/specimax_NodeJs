const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.shift.availability.controller');
const { authorize, USER } = require('../../../middlewares/auth');
const {
  getAvailability,
  updateAvailability,
} = require('../../../validations/user/user.availability.validation');

const router = express.Router();

router
  .route('/')
  .get(authorize(USER), validate(getAvailability), controller.get);

router
  .route('/:availabilityId')
  .patch(authorize(USER), validate(updateAvailability), controller.update)
module.exports = router;
