const httpStatus = require('http-status');
const { omit } = require('lodash');
const Skill = require('../models/required.skill.and.experience.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const skill = await Skill.get(id);
    req.locals = { skill };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json({code: 200, message: 'Required skills and experience info retrieved successfully.', data: req.locals.skill.transform()});

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.skill.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const skill = new Skill(req.body);
    const savedSkill = await skill.save();
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Required skills and experience created successfully.', data: savedSkill.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { skill } = req.locals;
    const newSkill = new Skill(req.body);
    const newSkillObject = omit(newSkill.toObject(), '_id');

    await skill.updateOne(newSkillObject, { override: true, upsert: true });
    const savedSkill = await skill.findById(skill._id);

    res.json({code: 200, message: 'Required skills and experience updated successfully.', data: savedSkill.transform()});
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedSkill = omit(req.body);
  const skill = Object.assign(req.locals.skill, updatedSkill);

  skill.save()
    .then((skill) => res.json({code : 200, message : 'Required skills and experience updated successfully.', data: skill.transform()}))
    .catch((e) => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const skills = await Skill.list(req.query);
    const transformedSkills = skills.map((skill) => skill.transform());
    res.json({code : 200, message : 'Required skills and experience list retrieved successfully.', data: transformedSkills});
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { skill } = req.locals;
  skill.remove()
    .then(() => res.json({code : 200, message : 'Required skills and experience deleted successfully.', data: null}))
    .catch((e) => next(e));
};
