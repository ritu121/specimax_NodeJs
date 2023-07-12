const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/portfolio.report.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const router = express.Router();

router.route('/roster-shift-overview')
    .get(authorize(),controller.rosterShiftOverview)

router.route('/casual-shift-overview')
    .get(authorize(),controller.casualShiftOverview)

router.route('/alarm-response-overview')
    .get(authorize(),controller.alarmResponseOverview)

router.route('/task-overview')
    .get(authorize(),controller.taskOverview)

router.route('/defect-and-injury-overview')
    .get(authorize(),controller.defectInjuryOverview)

router.route('/shift-log-overview')
    .get(authorize(),controller.shiftLogOverview)

router.route('/tenancy-check-overview')
    .get(authorize(),controller.tenancyOverview)

router.route('/complience-overview')
    .get(authorize(),controller.complienceOverview)

router.route('/inspection-and-reports-overview')
    .get(authorize(),controller.inspectionOverview)

module.exports = router;
