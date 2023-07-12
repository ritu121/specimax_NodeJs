const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const RiskAssessmentChoiceOptionSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
  },

}, {
  timestamps: true,
});


RiskAssessmentChoiceOptionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id','name','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


RiskAssessmentChoiceOptionSchema.statics = {
  async get(id) {
    let report;

    if (mongoose.Types.ObjectId.isValid(id)) {
        report = await this.findById(id).exec();
    }
    if (report) {
      return report;
    }

    throw new APIError({
      message: 'Risk assessment choice option does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 25, name
  }) {
    const options = omitBy({ name}, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('RiskAssessmentChoiceOption', RiskAssessmentChoiceOptionSchema,'risk_assessment_choice_options');
