const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/all.report.type.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const {
  listReportTypes,
  createReportType,
  replaceReportType,
  updateReportType,
} = require('../../validations/report.type.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('typeId', controller.load);

router
  .route('/')
  .get(validate(listReportTypes), controller.list)
  .post(authorize(ADMIN_USER), validate(createReportType), controller.create);

router
  .route('/site-overview')
  .get(authorize(ADMIN_USER), controller.listSorted)

router
  .route('/:typeId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceReportType), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateReportType), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);


module.exports = router;
