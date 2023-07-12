const express = require('express');
const validate = require('express-validation');
const Controller = require('../../../controllers/company-admin/site.controller');
const adminController = require('../../../controllers/admin/site.controller');
const { authorize, ADMIN, LOGGED_USER, ADMIN_USER } = require('../../../middlewares/auth');
const {
  listSites,
  createSite,
  replaceSite,
  updateSite,
  addTeamMember,
  addCheckPoint
} = require('../../../validations/site.validation');
const { handlePermission } = require('../../../middlewares/permissions');
const { isLoggedIn } = require('../../../middlewares/adminAuth');

const router = express.Router();

router.param('locId', Controller.load);


router.route('/site-team/:locId')
  .get(authorize(ADMIN_USER),Controller.getSiteTeam)

router.route('/live-view')
  .get(isLoggedIn,Controller.getLiveView)
router.route('/overview/:locId')
  .get(authorize(ADMIN_USER),Controller.getOverview)

router.route('/add-member/:locId')
  .post(authorize(ADMIN_USER), validate(addTeamMember), Controller.addTeamMember)

router
  .route('/list/clockinout')
  .get(authorize(ADMIN), Controller.allClockInOut);

  router
  .route('/export/clockinout')
  .get(authorize(ADMIN), Controller.exportAllClockInOut);

router
  .route('/list/failedclock')
  .get(authorize(ADMIN), Controller.failedCheckin);

router
  .route('/export/failedclock')
  .get(authorize(ADMIN), Controller.exportFailedCheckin);

router
  .route('/export/me')
  .post(authorize(ADMIN), Controller.exportMe);

module.exports = router;
