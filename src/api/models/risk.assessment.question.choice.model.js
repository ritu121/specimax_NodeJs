const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const RiskAssessmentQuestionChoiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  options : [{
    type: mongoose.Schema.ObjectId,
    ref: 'RiskAssessmentChoiceOption',
    required:true,
  }]
}, {
  timestamps: true,
});


RiskAssessmentQuestionChoiceSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id','name','options','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


RiskAssessmentQuestionChoiceSchema.statics = {
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
        choice = await this.findById(id).populate('options').exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'Choice does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30,  options
  }) {
    const option = omitBy({ options}, isNil);

    return this.find(option)
      .populate('options')
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('RiskAssessmentQuestionChoice', RiskAssessmentQuestionChoiceSchema,'risk_assessment_question_choices');
