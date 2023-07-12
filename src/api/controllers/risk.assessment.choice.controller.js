const httpStatus = require('http-status');
const { omit } = require('lodash');
const Category = require('../models/risk.assessment.category.model');
const Question = require('../models/risk.assessment.question.model');
const Choice = require('../models/risk.assessment.question.choice.model');

exports.load = async (req, res, next, id) => {
  try {
    const choice = await Choice.get(id);
    req.locals = { choice };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async (req, res) =>{
  let choiceId = req.params.choiceId;
  let choice = await Choice.findOne({_id : choiceId}).populate('options')
  res.json({code: 200, message: 'Risk assessment question choice retrieved successfully.', data: choice})
};


exports.options = async (req, res) =>{
  let choiceId = req.params.choiceId;
  let choice = await Choice.findOne({_id : choiceId}).populate('options')
  res.json({code: 200, message: 'Risk assessment choice retrieved successfully.', data: choice.options})
};


exports.create = async (req, res, next) => {
  try {
    const choice = new Choice(req.body);
    const savedChoice = await choice.save();

    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Risk assessment question choice created successfully.', data: savedChoice.transform()});
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  const choice = await Choice.updateOne({_id : req.params.choiceId}, req.body)
    .then(async(choice) => {
        let newChoice = await Choice.findOne({_id : req.params.choiceId})
        res.json({code : 200, message : 'Risk assessment question choice updated successfully.', data: newChoice})
    })
    .catch((e) => next(e));
};




exports.list = async (req, res, next) => {
  try {
    const choices = await Choice.list(req.query);
    const transformedChoices = choices.map((status) => status.transform());
    res.json({code : 200, message : 'Risk assessment question choice list retrieved successfully.', data: transformedChoices});
  } catch (error) {
    next(error);
  }
};


exports.remove = async(req, res, next) => {
  let choice = await Choice.findOne({_id : req.params.choiceId})

  if(choice){
       let questions = await Question.find({choiceId : req.params.choiceId});
       if(questions){
        for(var i = 0; i < questions.length; i++){
          let updateQuestion = await Question.updateOne({_id : questions[i]._id},{choiceId : null, optionId : null});
        }

        Choice.deleteOne({_id : req.params.choiceId})
        .then(async () => {
            res.json({code : 200, message : 'Risk assessment question choice delete successfully.', data : {}})
        })
        .catch((e) => next(e));
       }
       else{
        Choice.deleteOne({_id : req.params.choiceId})
        .then(async () => {
            res.json({code : 200, message : 'Risk assessment question choice delete successfully.', data : {}})
        })
        .catch((e) => next(e));
       }
  }
  else{
    res.json({code : 404, message : 'Risk assessment question choice not found.', data : {}})
  }

};
