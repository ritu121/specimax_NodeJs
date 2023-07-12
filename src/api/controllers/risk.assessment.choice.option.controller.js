const httpStatus = require('http-status');
const { omit } = require('lodash');
const Option = require('../models/risk.assessment.choice.option.model');


exports.get = async (req, res) =>{
  let optionId = req.params.optionId;
  let option = await Option.findOne({_id : optionId})
  res.json({code: 200, message: 'Risk assessment question choice option retrieved successfully.', data: choice})
};



exports.create = async (req, res, next) => {
  try {
    const option = new Option(req.body);
    const savedOption = await option.save();

    res.status(httpStatus.CREATED);
    res.json({code: 201, message: 'Risk assessment choice option created successfully.', data: savedOption.transform()});
  } catch (error) {
    next(error);
  }
};

exports.update = async(req, res, next) => {
  const option = await Option.updateOne({_id : req.params.optionId}, req.body)
    .then(async(option) => {
        let newOption = await Option.findOne({_id : req.params.optionId})
        res.json({code : 200, message : 'Risk assessment choice option updated successfully.', data: newOption})
    })
    .catch((e) => next(e));
};




exports.list = async (req, res, next) => {
  try {
    const options = await Option.list(req.query);
    const transformedOptions = options.map((status) => status.transform());
    res.json({code : 200, message : 'Risk assessment choice option list retrieved successfully.', data: transformedOptions});
  } catch (error) {
    next(error);
  }
};


exports.remove = async(req, res, next) => {
  let option = await Option.findOne({_id : req.params.optionId})

  if(option){
       Option.deleteOne({_id : req.params.optionId})
        .then(async () => {
            res.json({code : 200, message : 'Risk assessment choice option delete successfully.', data : {}})
        })
        .catch((e) => next(e));
  }
  else{
    res.json({code : 404, message : 'Risk assessment choice option not found.', data : {}})
  }

};
