const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const shiftSchema = new mongoose.Schema({
  company:{
    type : mongoose.Schema.ObjectId,
    ref : 'Company',
    required: true,
  },
  sites:[{
    type: mongoose.Schema.ObjectId,
    ref : 'Site',
    required: true,
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref : 'User',
    required: true,
  },
  title :{
    type: String,
    required: true,
  },
  description :{
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  // dueTime:{
  //   type:String,
  //   required:true
  // },
  startTime:{
      type:String,
      required:true
  },
  endTime:{
    type:String,
    required:true
  },
  status:{
    type: String,
    required: false,
    default : "Booked",
  },
}, {
  timestamps: true,
});


 shiftSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'company','sites' ,'user','title','description', 'dueDate','startTime','endTime','status', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


 shiftSchema.statics = {
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
      choice = await this.findById(id).populate([
        {
          path : 'company',
          model : 'Company'
        },
        {
          path : 'sites',
          model : 'Site'
        },
        {
          path : 'user',
          model : 'User'
        },
      ]).exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'Shift does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 25, status, startTime, endTime,startDate, endDate,siteId, userId, companyId, createdAt
  }) {
    var options = {}
    if(startDate && endDate){
       options = omitBy({ status, dueDate : {$gte : startDate} ,dueDate : {$lte : endDate}, sites : siteId, company : companyId, user : userId }, isNil);
    }
    else if(startDate && !endDate){
      options = omitBy({ status, dueDate : {$gte : startDate}, sites : siteId, company : companyId, user : userId }, isNil);
    }
    else if(startDate && !endDate){
      options = omitBy({ status, dueDate : {$lte : endDate},  sites : siteId, company : companyId, user : userId }, isNil);
    }
    else{
      options = omitBy({  sites : siteId, company : companyId, user : userId ,status }, isNil);
    }
    
    return this.find(options)
      .populate([
        {
          path : 'company',
          model : 'Company'
        },
        {
          path : 'sites',
          model : 'Site'
        },
        {
          path : 'user',
          model : 'User'
        },
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Alarm', shiftSchema);
