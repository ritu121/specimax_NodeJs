const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/tenancy.check.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listLogs,
  createLogs,
  replaceLogs,
  updateLogs
} = require('../../validations/shift.logs.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('shiftId', controller.load);

router
  .route('/')
  .get(authorize(), controller.list)
router.route('/fetchList')
 .get(authorize(),controller.AllTenencyCheck)
router
  .route('/addfloor')
  .post(authorize(), controller.addArea)
router.route('/submit').patch(authorize(), controller.submitTenancy)

router
  .route('/:shiftId')
  .get(authorize(), controller.get)
  .delete(authorize(), controller.remove);

router
  .route('/fetch/file')
  .get(authorize(), controller.filterTenencyCheck);

  router
  .route('/export/file')
  .get(authorize(), controller.exportTenancyCheck);


module.exports = router;
