const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/site.checkpoints.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { handlePermission } = require('../../middlewares/permissions');
const {
    addCheckPoint
} = require('../../validations/site.validation');

const router = express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('checkId', controller.load);


router.route('/')
    .get(authorize(),handlePermission('632034fdf77af453ecb4f415'), controller.list)
    .post(authorize(),handlePermission('634508f00c0c612c23bd8981'), validate(addCheckPoint), controller.create)

router.route('/:checkId')
    .get(authorize(), controller.get)
    .patch(authorize(),  controller.update)
    .delete(authorize(),  controller.remove)

module.exports=router