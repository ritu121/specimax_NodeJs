const express = require('express');
const controller = require('../../controllers/export.data.controller');
const router = express.Router();

router
    .route('/tenancy-check')
    .get(controller.exportTenancyCheck)

router
    .route('/casual-shifts')
    .get(controller.exportCasualShift)
router
    .route('/roster')
    .get(controller.exportRosters)
router
    .route('/clockinout')
    .get(controller.exportAllClockInOut)
router
    .route('/failedclock')
    .get(controller.exportFailedCheckin)
router
    .route('/report')
    .get(controller.exportfilterReport)
router
    .route('/support')
    .get(controller.exportSupport)
router
    .route('/tasks')
    .get(controller.exportTasks)
router
    .route('/alarms')
    .get(controller.exportAlarms)
router
    .route('/shift-logs')
    .get(controller.exportShiftLogs)

module.exports =router