const express=require('express');
const validation=require('express-validation');
const controller=require("../../controllers/risk.category.controller");
const { authorize, ADMIN, USER, LOGGED_USER , ADMIN_USER} = require('../../middlewares/auth');
const {
    listCategory,
    createCategory,
    replaceCategory,
    updateCategory
}=require('../../validations/user/risk.category.validation');


const router=express.Router();

/**
 * Load tracker when API with trackerId route parameter is hit
 */
router.param('CategoryId', controller.load);

router
    .route('/')
    .get(authorize(LOGGED_USER),controller.list)
    .post(authorize(ADMIN_USER),controller.update)