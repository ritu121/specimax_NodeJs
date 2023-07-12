const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/notification.controller');
// const { authorize, ADMIN, LOGGED_USER } = require('../../../middlewares/auth');
const {authorize, ADMIN, ADMIN_USER, USER} = require('../../middlewares/auth');
const { handlePermission } = require('../../middlewares/permissions');
const {
  listSites,
  createSite,
  replaceSite,
  updateSite,
} = require('../../validations/company/site.validation');

const router = express.Router();
router.param('notificationId', controller.load);


router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER),handlePermission('6335dbc4d4d22b9159638bc1'), controller.create);

router.route('/user').get(authorize(USER),controller.listByUser)

router
  .route('/:notificationId')
  .get(authorize(ADMIN_USER), controller.get)
  .patch(authorize(ADMIN_USER),handlePermission('6335dbc8d4d22b9159638bc4'), controller.update)
  .delete(authorize(ADMIN_USER),handlePermission('6335dbced4d22b9159638bc7'), controller.remove);

module.exports = router;
