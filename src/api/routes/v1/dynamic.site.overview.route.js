const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/dynamic.site.overview.report.controller');
const { authorize, ADMIN_USER, LOGGED_USER } = require('../../middlewares/auth');
const router = express.Router();


router.param('dynamicId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), controller.list)
  .post(authorize(ADMIN_USER), controller.create)


router
  .route('/:dynamicId')
  .put(authorize(ADMIN_USER), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove)
  
  
module.exports = router;
