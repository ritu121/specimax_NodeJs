const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const RiskAssessmentQuestionSchema = new mongoose.Schema({
  siteId:[{
    type: mongoose.Schema.ObjectId,
    ref : 'Site',
    required: true,
  }],
  riskAssessmentCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentCategory',
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  category:[{
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentChoiceOption',
  }],
  subCategory:[{
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentChoiceOption',
  }],
  riskIdentified:[{
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentChoiceOption',
  }],
  likelihood:[{
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentChoiceOption',
  }],
  impact:[{
    type: mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentChoiceOption',
  }],
  // choices: [{
  //   choiceId : {
  //     type: mongoose.Schema.ObjectId,
  //     ref : 'RiskAssessmentQuestionChoice',
  //     required: true,
  //   },
  //   options : [{
  //       type: mongoose.Schema.ObjectId,
  //       ref : 'RiskAssessmentChoiceOption',
  //       required: true,
  //   }]
  // }],
  rating : [{
    type : mongoose.Schema.ObjectId,
    ref : 'RiskAssessmentChoiceOption',
  }],
  note : {
    type : String,
    required : false,
  }
}, {
  timestamps: true,
});


RiskAssessmentQuestionSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id','siteId','riskAssessmentCategoryId','question','choices','category','subCategory','impact','riskIdentified','likelihood','rating','note','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


RiskAssessmentQuestionSchema.statics = {
  async get(id) {
    let question;

    if (mongoose.Types.ObjectId.isValid(id)) {
      question = await this.findById(id).populate('riskAssessmentCategoryId choices').exec();
    }
    if (question) {
      return question;
    }

    throw new APIError({
      message: 'Question does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30,  riskAssessmentCategoryId , options, siteId
  }) {
    const option = omitBy({ riskAssessmentCategoryId, options, siteId}, isNil);
    // var options = {};
    // if(riskAssessmentCategoryId){
    //   options['riskAssessmentCategoryId'] = riskAssessmentCategoryId;
    // }
    // if(siteId){
    //   options['siteId'] = {$in : }
    // }

    return this.find(option)
      .populate([
        {
          path : 'siteId',
          select : "name"
        },
        {
          path : 'riskAssessmentCategoryId',
          select : "name"
        }
        ,
        {
          path : 'choices',
          
          select : "choiceId options",
          populate : [
            {
              path : 'choiceId',
              model : 'RiskAssessmentQuestionChoice',
              select : 'name'
            },
            {
              path : 'options',
              model : 'RiskAssessmentChoiceOption',
              select : 'name'
            }
          ]
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('RiskAssessmentQuestion', RiskAssessmentQuestionSchema,'risk_assessment_questions');
