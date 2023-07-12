const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/support.controller');
const { authorize, ADMIN_USER } = require('../../middlewares/auth');
const {
  listSupports,
  createSupport,
  replaceSupport,
  updateSupport,
} = require('../../validations/support.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('supportId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), validate(createSupport), controller.create);

router.route('/export')
  .get(controller.exportSupport)

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

router
  .route('/:supportId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceSupport), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateSupport), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
