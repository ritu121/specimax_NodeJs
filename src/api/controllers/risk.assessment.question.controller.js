const httpStatus = require('http-status');
const { omit } = require('lodash');
const Category = require('../models/risk.assessment.category.model');
const Question = require('../models/risk.assessment.question.model')

exports.load = async (req, res, next, id) => {
  try {
    const question = await Question.get(id);
    req.locals = { question };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async(req, res) => {
  let question = await Question.findOne({_id : req.params.questionId})
  .populate([
    {
      path : 'riskAssessmentCategoryId',
      select : "name"
    }
    ,
    {
      path : 'choices',
      
      select : "choiceId optionId",
      populate : [
        {
          path : 'choiceId',
          model : 'RiskAssessmentQuestionChoice',
          select : 'name'
        },
        {
          path : 'optionId',
          model : 'RiskAssessmentChoiceOption',
          select : 'name'
        }
      ]
    }
  ]);
  res.json({code: 200, message: 'Risk assessment question retrieved successfully.', data: question})
};


exports.create = async (req, res, next) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();

    // const category = await Category.findOne({_id : savedQuestion.riskAssessmentCategoryId});
    // if(category){
    //     var choices = category.questions;
    //     choices.push(savedQuestion);
    //     const updateCategory = await Category.updateOne({_id : savedQuestion.riskAssessmentCategoryId},{questions : choices})
    // }
    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Risk assessment question created successfully.', data: savedQuestion.transform()});
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  const question = await Question.updateOne({_id : req.params.questionId}, req.body)
    .then(async(question) => {
        let newQuestion = await Question.findOne({_id : req.params.questionId})
        res.json({code : 200, message : 'Risk assessment question updated successfully.', data: newQuestion.transform()})
    })
    .catch((e) => next(e));
};


exports.getQuestionCategory = async (req, res, next) => {
    try {
      const questions = await Question.find({riskAssessmentCategoryId : req.params.categoryId}).populate([{
        path : 'riskAssessmentCategoryId',
        model : 'RiskAssessmentCategory',
        select : 'name'
      },{
        path:'category',
        model:"RiskAssessmentChoiceOption"
      },
      {
        path:'subCategory',
        model:"RiskAssessmentChoiceOption"
      },
      {
        path:'impact',
        model:"RiskAssessmentChoiceOption"
      },
      {
        path:'riskIdentified',
        model:"RiskAssessmentChoiceOption"
      },
      {
        path:'likelihood',
        model:"RiskAssessmentChoiceOption"
      },
      {
        path:'rating',
        model:"RiskAssessmentChoiceOption"
      },
    ]);
    // questions['rating']=['Low','High']
      const transformedQuestions = questions.map((status) => status.transform());
      res.json({code : 200, message : 'Risk assessment question list retrieved successfully.', data: transformedQuestions});
    } catch (error) {
      next(error);
    }
}


exports.list = async (req, res, next) => {
  try {
    const questions = await Question.list(req.query);
    // const transformedQuestions = questions.map((status) => status.transform());
    res.json({code : 200, message : 'Risk assessment question list retrieved successfully.', data: questions});
  } catch (error) {
    next(error);
  }
};


exports.remove = async(req, res, next) => {
  let question = await Question.findOne({_id : req.params.questionId})
 
  if(question){
       Question.deleteOne({_id : req.params.questionId})
        .then(async () => {
            
            // const category = await Category.findOne({_id : question.riskAssessmentCategoryId});
            // if(category){
            //     var options = category.questions;
            //     options = options.filter((item) => item !== req.params.questionId);
            //     const updateCategory = await Category.updateOne({_id : question.riskAssessmentCategoryId},{questions : options})
            // }
            res.json({code : 200, message : 'Risk assessment question delete successfully.', data : {}})
        })
        .catch((e) => next(e));
  }
  else{
    res.json({code : 404, message : 'Risk assessment question not found.', data : {}})
  }

};
