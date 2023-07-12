const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
  createAdminUser,
} = require('../../validations/user.validation');

const router = express.Router();


router.param('userId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listUsers), controller.list)
  .post(authorize(ADMIN_USER), validate(createAdminUser), controller.create);

router
  .route('/by-company/:companyId')
  .get(authorize(), controller.listCompanyUser)

router
  .route('/app')
  .get(authorize(ADMIN_USER), validate(listUsers), controller.listApp)

  
router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:userId')
  .get(authorize(), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceUser), controller.replace)
  .patch(authorize(ADMIN_USER),  controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
