const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const requiredSkillAndExperienceSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    trim: true,
  },
  shiftId: {
    type:mongoose.Schema.ObjectId,
    ref:'CasualShift'
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
 requiredSkillAndExperienceSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'skill', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
 requiredSkillAndExperienceSchema.statics = {
  async get(id) {
    let skill;

    if (mongoose.Types.ObjectId.isValid(id)) {
      skill = await this.findById(id).exec();
    }
    if (skill) {
      return skill;
    }

    throw new APIError({
      message: 'Required skills and experience does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

 
  list({
    page = 1, perPage = 30, skill, 
  }) {
    const options = omitBy({ skill}, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('RequiredSkillAndExperience', requiredSkillAndExperienceSchema,'required_skills_and_experiences');
