const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/user/user.profile.controller');
const { authorize, USER,ADMIN } = require('../../../middlewares/auth');
const {
  getProfile,
  updateProfile,
  deleteProfile
} = require('../../../validations/user/user.profile.validation');

const router = express.Router();

router
  .route('/')
  .get(authorize(USER), validate(getProfile), controller.get)
  .patch(authorize(USER), controller.update)
  .delete(authorize(USER), validate(deleteProfile), controller.delete);
router
  .route('/image')
  
  .patch(authorize(USER), controller.updateProfileImage)
  
router
  .route('/:userId')
  .get(authorize(ADMIN), controller.getById)
  .patch(authorize(ADMIN), validate(updateProfile), controller.updateById)

router
  .route('/:userId/:exprId')
  .delete(controller.deleteExperience)

module.exports = router;
