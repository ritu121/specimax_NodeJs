const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/required.skill.and.experience.controler');
const { authorize, ADMIN_USER, USER } = require('../../middlewares/auth');
const {
  listSkills,
  createSkill,
  replaceSkill,
  updateSkill,
} = require('../../validations/required.skills.and.experiences.validation');

const router = express.Router();

router.param('skillId', controller.load);

router
  .route('/')
  .get(authorize(ADMIN_USER), validate(listSkills), controller.list)
  .post(authorize(ADMIN_USER), validate(createSkill), controller.create);

router
  .route('/skill')
  .get(authorize(), controller.loggedIn);

router
  .route('/:skillId')
  .get(authorize(ADMIN_USER), controller.get)
  .put(authorize(ADMIN_USER), validate(replaceSkill), controller.replace)
  .patch(authorize(ADMIN_USER), validate(updateSkill), controller.update)
  .delete(authorize(ADMIN_USER), controller.remove);

module.exports = router;
