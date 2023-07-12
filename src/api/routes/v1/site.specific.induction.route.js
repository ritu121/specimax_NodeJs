const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/site.specific.induction.controller');
const { authorize, USER } = require('../../middlewares/auth');
const {
  listSites,
  createSite,
  replaceSite,
  updateSite,
} = require('../../validations/site.specific.induction.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('siteId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listSites), controller.list)
  .post(authorize(USER), validate(createSite), controller.create);
  
router
  .route('/:siteId')
  .get(authorize(USER), controller.get)
  .patch(authorize(USER), validate(replaceSite), controller.update)
  .put(authorize(USER), validate(updateSite), controller.replace)
  .delete(authorize(USER), controller.remove);
  
router
  .route('/export/:site')
  .get(authorize(USER), controller.exportDocument);
module.exports = router;
