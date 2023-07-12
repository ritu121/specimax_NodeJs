const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const RiskAssessmentReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  siteId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: true,
  },
  riskAssessmentCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'RiskAssessmentCategory',
    required: true,
  },
  questions: [
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'RiskAssessmentQuestion',
        required: true,
      },
      notes: {
        type: String,
        required: false
      },
      category:{
        type: mongoose.Schema.ObjectId,
        ref : 'RiskAssessmentChoiceOption',
      },
      subCategory:{
        type: mongoose.Schema.ObjectId,
        ref : 'RiskAssessmentChoiceOption',
      },
      riskIdentified:{
        type: mongoose.Schema.ObjectId,
        ref : 'RiskAssessmentChoiceOption',
      },
      likelihood:{
        type: mongoose.Schema.ObjectId,
        ref : 'RiskAssessmentChoiceOption',
      },
      impact:{
        type: mongoose.Schema.ObjectId,
        ref : 'RiskAssessmentChoiceOption',
      },
      rating : {
        type : mongoose.Schema.ObjectId,
        ref : 'RiskAssessmentChoiceOption',
      },
      // choiceId: [
      //   {
      //     choice: {
      //       type: mongoose.Schema.ObjectId,
      //       ref: 'RiskAssessmentQuestionChoice',
      //       required: false,
      //     },
      //     optionId: {
      //       type: mongoose.Schema.ObjectId,
      //       ref: 'RiskAssessmentChoiceOption',
      //       required: false,
      //     },
      //   }],
      media: {
        type: String,
        required: false
      },
    }
  ],
}, {
  timestamps: true,
});


RiskAssessmentReportSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'userId', 'siteId', 'riskAssessmentCategoryId', 'questions', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


RiskAssessmentReportSchema.statics = {
  async get(id) {
    let report;

    if (mongoose.Types.ObjectId.isValid(id)) {
      report = await this.findById(id).populate('userId siteId riskAssessmentCategoryId questions').exec();
    }
    if (report) {
      return report;
    }

    throw new APIError({
      message: 'Risk assessment report does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30, riskAssessmentCategoryId, questionId, siteId, useId
  }) {
    const options = omitBy({ riskAssessmentCategoryId, questionId, siteId, useId }, isNil);

    return this.find(options)
      .populate([
        {
          path: 'userId',
          select: 'firstname lastname'
        },
        {
          path: 'siteId',
          select: 'name'
        },
        {
          path: 'riskAssessmentCategoryId',
          select: 'name'
        },
        {

          path: 'questions',
          select: 'questionId comment choiceId optionId media',
          populate: [
            {
              path: 'questionId',
              select: 'question'
            },
            {
              path: 'category',
              select: 'name'
            },
            {
              path: 'subCategory',
              select: 'name'
            },
            {
              path: 'riskIdentified',
              select: 'name'
            },
            {
              path: 'likelihood',
              select: 'name'
            },
            {
              path: 'impact',
              select: 'name'
            },
            {
              path: 'rating',
              select: 'name'
            },
          ]
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('RiskAssessmentReport', RiskAssessmentReportSchema, 'risk_assessment_reports');
