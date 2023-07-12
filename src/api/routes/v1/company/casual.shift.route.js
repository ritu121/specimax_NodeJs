const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/company/casual.shift.controller');
// const { authorize, ADMIN, LOGGED_USER } = require('../../../middlewares/auth');
const {authorize, ADMIN_USER} = require('../../../middlewares/auth');
const { handlePermission } = require('../../../middlewares/permissions');
const {
  listSites,
  createSite,
  replaceSite,
  updateSite,
} = require('../../../validations/company/site.validation');

const router = express.Router();
router.param('shiftId', controller.load);


router
  .route('/')
  .get(authorize(ADMIN_USER), controller.listReport)
  .post(authorize(ADMIN_USER), controller.create);

router
  .route('/group-by-id/:groupId')
  .get(authorize(ADMIN_USER), controller.listGroup)

router
  .route('/:shiftId')
  .patch(authorize(ADMIN_USER), controller.updateShift)
  .delete(authorize(ADMIN_USER), controller.deleteShift);

router
  .route('/change-status/:shiftId')
  .patch(authorize(ADMIN_USER), controller.updateStatus)

router
  .route('/list')
  .get(authorize(ADMIN_USER), controller.casualShiftList);

router
  .route('/export/list')
  .get(authorize(ADMIN_USER), controller.exportCasualShift);

router
  .route('/site')
  .get(authorize(), controller.loggedIn);

router
  .route('/accept-interest')
  .post(authorize(ADMIN_USER),controller.accpetInterest);  

router
  .route('/re-assigned/:shiftId')
  .put(authorize(), controller.reAssignInterest);

router
  .route('/:shiftId')
  .get(authorize(ADMIN_USER), controller.get)
  .post(authorize(ADMIN_USER), controller.accpetInterest)
  .patch(authorize(ADMIN_USER) ,validate(updateSite), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
