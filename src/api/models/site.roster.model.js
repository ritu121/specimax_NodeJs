const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
const ObjectId = mongoose.Types.ObjectId;

const rosterSchema = new mongoose.Schema({
    // shiftDates: {
    //     type: Date,
    //     // required: true,
    // },
    isGroup :{
      type : Boolean,
      required : true,
      default : false
    },
    groupId :{
      type : String,
      required : true
    },
    siteId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Site',
      required: true
    },
    role: {
      type: mongoose.Schema.ObjectId,
      ref: 'Role',
    },
    shiftCode: {
      type: String,
      required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    shiftDate: {
      type: Date,
      required: false,
      default : null
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    recurrenceType :{
        type : String,
        enum : ['Weekly','Monthly','Yearly'],
        default : 'Weekly',
        required : true
    },
    recurrenceDay :[{
      type : Number,
      required : true
    }],
    // userId: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    // },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    assignedUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default : null
    },
    status:{
      type: String,
      required: true,
      enum : ['Reassign','Approved','Cancel','Unassigned','Assigned','In Process'],
      default : "Unassigned",
    },
},{timestamps:true})


rosterSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'userId','role', 'siteId', 'startDate','endDate','startTime','endTime', 'shiftCode', 'assignedUser','status'];
  
      fields.forEach((field) => {
        transformed[field] = this[field];
      });
  
      return transformed;
    },
  });
  
  
   rosterSchema.statics = {
    async get(id) {
      let choice;
  
      if (mongoose.Types.ObjectId.isValid(id)) {
        choice = await this.findById(id).populate([
          {
            path : 'siteId',
            model : 'Site'
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
  
  
    async list({
      page = 1, perPage = 25, status, startDate,endDate,userId, startTime,endTime,from,to,siteId
    }) {
      var options = {};
      if(startDate){
        options['shiftDate'] = { shiftDate : {$gte : startDate}};
      }
      if(endDate){
        options['shiftDate'] = { shiftDate : {$gte : endDate}};
      }
      if(status){
        options['status'] = status;
      }
      if(siteId){
        options['siteId'] = ObjectId(siteId);
      }
     
      if(userId){
        options['assignedUser'] = userId
      }

      // const options = omitBy({ startDate,endDate, from, siteId, assignedUser }, isNil);
      let output = await this.aggregate([
        {
          $sort : {
            'createdAt' : -1
          }
        },
        {
          $match : options
        },
        {
          $group : {
            "_id" : {
              isGroup : "$isGroup",
              groupId : "$groupId",
            },
            shifts : {
              $push : "$$ROOT"
            }
          }
        },
      ]).skip(perPage * (page - 1)).limit(perPage).exec()
  
       let populateQuery =  [
          {
            path : 'shifts.role',
            model : 'Role',
            select : 'name'
          },
          {
            path : 'shifts.createdBy',
            model : 'User',
            select : 'firstname lastname'
          },
         
          {
            path : 'shifts.siteId',
            model : 'Site',
            select: "name",
          },
          {
            path : 'shifts.assignedUser',
            model : 'User',
            select: "firstname lastname"
          },
          {
            path : 'shifts.createdBy',
            model : 'User',
            select: "firstname lastname"
          },
        ];
  
      return this.populate(output,populateQuery);
    },
  };
  
  module.exports = mongoose.model('ShiftRoster', rosterSchema,'shift_rosters');
  