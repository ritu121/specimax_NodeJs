const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/key.shift.duty.controller');
const { authorize, ADMIN, USER } = require('../../../middlewares/auth');
const {
  listDuties,
} = require('../../../validations/key.shift.duties.validation');

const router = express.Router();

router.param('dutyId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listDuties), controller.list)

router
  .route('/duty')
  .get(authorize(), controller.loggedIn);

router
  .route('/:dutyId')
  .get(authorize(USER), controller.get)

module.exports = router;
