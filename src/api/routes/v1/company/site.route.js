const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/company/site.controller');
// const { authorize, ADMIN, LOGGED_USER } = require('../../../middlewares/auth');
const {authorize, ADMIN, LOGGED_USER, ADMIN_USER} = require('../../../middlewares/auth');
const { handlePermission } = require('../../../middlewares/permissions');
const {
  listSites,
  createSite,
  replaceSite,
  updateSite,
} = require('../../../validations/company/site.validation');

const router = express.Router();

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listSites),controller.list)
  .post(authorize(ADMIN_USER), validate(createSite), controller.create);

router
  .route('/site')
  .get(authorize(ADMIN_USER), controller.loggedIn);

router
  .route('/:locId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceSite), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateSite), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
