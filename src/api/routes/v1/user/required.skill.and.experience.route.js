const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/required.skill.and.experience.controler');
const { authorize, ADMIN, USER } = require('../../../middlewares/auth');
const {
  listSkills,
} = require('../../../validations/required.skills.and.experiences.validation');

const router = express.Router();

router.param('skillId', controller.load);

router
  .route('/')
  .get(authorize(USER), validate(listSkills), controller.list)

router
  .route('/skill')
  .get(authorize(), controller.loggedIn);

router
  .route('/:skillId')
  .get(authorize(USER), controller.get)


module.exports = router;
