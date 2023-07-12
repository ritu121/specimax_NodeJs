const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/shift.roster.controller');
// const { authorize, ADMIN_USER, LOGGED_USER } = require('../../../middlewares/auth');
const {authorize, ADMIN_USER} = require('../../middlewares/auth')
const {
  listSites,
  createSite,
  replaceSite,
  updateSite,
} = require('../../validations/company/site.validation');

const router = express.Router();
router.param('shiftId', controller.load);


router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create);

router 
  .route('/list')
  .get(authorize(ADMIN_USER), controller.listRoster);

router
  .route('/site')
  .get(authorize(), controller.loggedIn);

router
  .route('/reassign/:shiftId')
  .post(authorize(), controller.reassign);

router
  .route('/:shiftId')
  .get(authorize(ADMIN_USER), controller.get)
//   .post(authorize(ADMIN_USER), controller.accpetInterest)
  .patch(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

  router
  .route('/group-by/:groupId')
  .delete(authorize(ADMIN_USER), controller.removeGroup);

router
  .route('/shift/list')
  .get(authorize(ADMIN_USER), controller.ShiftList);
router
  .route('/export/roster')
  .get(authorize(ADMIN_USER), controller.exportRosters);

module.exports = router;
