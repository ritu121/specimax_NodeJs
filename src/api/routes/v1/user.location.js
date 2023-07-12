const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.location.controller');
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
  .get(authorize(USER), controller.list)
  .post(authorize(USER), controller.update)



  
module.exports = router;
