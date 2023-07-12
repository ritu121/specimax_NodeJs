const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const shiftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    // required: true,
    ref : 'User',

    // trim: true,
  },
  company:{
    type : mongoose.Schema.ObjectId,
    ref : 'Company',
    // required: true
  },
  status:{
    type: String,
    required: false,
    default : "Booked",
  },
  sites:[],

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime:{
    type:String,
    required:false,
    default:null
  },
  endTime:{
    type:String,
    required:false,
    default:null
  },
  shiftRecurrence:{
    type:mongoose.Schema.ObjectId,
    ref:'RecurrenceType'
  },
  shiftCode:{
    type:String,
    // required:true,
  },
  mobileNumber:{
    type:String,
    required:true,
  },



}, {
  timestamps: true,
});


 shiftSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'userId','company' ,'status','sites','mobileNumber', 'startDate','endDate','startTime','endTime', 'shiftRecurrence', 'shiftCode','woNumber','intrestedUsers', 'allowedBreaks','reportAt', 'createdAt'];

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
          path : 'sites.siteId',
          model : 'Site'
        },
        {
          path : 'company',
          model : 'Company'
        },
        {
          path : 'userId',
          model : 'User'
        },
        {
          path : 'shiftRecurrence',
        }
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
    page = 1, perPage = 30, status, startDate, startTime,endDate, endTime, siteId, createdAt
  }) {
    var options = {}
    if(startDate && endDate){
       options = omitBy({ status, createdAt, startDate : {$gte : startDate} ,endDate : {$lte : endDate}, "sites.siteId" : siteId }, isNil);
    }
    else if(startDate && !endDate){
      options = omitBy({ status, createdAt, startDate : {$gte : startDate}, "sites.siteId" : siteId }, isNil);
    }
    else if(startDate && !endDate){
      options = omitBy({ status, createdAt, endDate : {$lte : endDate}, "sites.siteId" : siteId }, isNil);
    }
    else{
      options = omitBy({ status, createdAt,"sites.siteId" : siteId }, isNil);
    }
    
    return this.find(options)
      .populate([
        {
          path : 'sites.siteId',
          model : 'Site'
        },
        {
          path : 'company',
          model : 'Company'
        },
        {
          path : 'userId',
          model : 'User'
        },
        {
          path : 'shiftRecurrence',
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Alarm', shiftSchema);
