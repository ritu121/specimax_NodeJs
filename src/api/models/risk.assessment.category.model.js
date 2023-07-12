const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const RiskAssessmentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  site:[
  {
    type : mongoose.Schema.ObjectId,
    ref : 'Site',
    required : true
  }
],
  questions :  [
    {
      type : mongoose.Schema.ObjectId,
      ref : 'RiskAssessmentQuestion',
      required : true
    }
  ]
}, {
  timestamps: true,
});


RiskAssessmentCategorySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name','site','questions', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

RiskAssessmentCategorySchema.statics = {
  async get(id) {
    let category;
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await this.findById(id).exec();
    }
    if (category) {
      return category;
    }

    throw new APIError({
      message: 'Risk assessment category does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30, name,
  }) {
    const options = omitBy({ name }, isNil);
    return this.find(options)
      .populate({path : 'site', model : 'Site'})
      .populate({path : 'questions', model : 'RiskAssessmentQuestion'})
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('RiskAssessmentCategory', RiskAssessmentCategorySchema,'risk_assessment_categories');
