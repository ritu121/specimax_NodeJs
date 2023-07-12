const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/key.shift.duty.controller');
const { authorize, ADMIN_USER, USER } = require('../../middlewares/auth');
const {
  listDuties,
  createDuty,
  replaceDuty,
  updateDuty,
} = require('../../validations/key.shift.duties.validation');

const router = express.Router();

router.param('dutyId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listDuties), controller.list)
  .post(authorize(ADMIN_USER), validate(createDuty), controller.create);

router
  .route('/duty')
  .get(authorize(), controller.loggedIn);

router
  .route('/:dutyId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceDuty), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateDuty), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
