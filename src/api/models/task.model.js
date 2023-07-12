const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
const {convertTime12to24} = require('../utils/helper')
const ObjectId = mongoose.Types.ObjectId;

const taskSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
  },
  siteId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: false,
    default : null
  },
  groupId: {
    type: String,
    required: true
  },
  isGroup: {
    type: Boolean,
    required: true,
    default : false
  },
  workOrderNo: {
    type: String,
    required: true,
    default: Math.floor(Math.random() * 99999999),
  },
  title: {
    type: String,
    required: true,
  },
  taskDate: {
    type: Date,
    required: false,
    default : null
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  timeDue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    default : 'Open'
  },
  serviceCategory:{
    type: String,
  },
  taskLogs:{
    type:mongoose.Schema.ObjectId,
    ref: 'TaskLogs',
    default: null
  },
  assignedUser: {
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required: false,
    default : null
  },
  vendor: {
    type:String,
    default:""
  },
  shiftRecurrence: {
    type:String,
    enum : ['Weekly','Monthly','Yearly'],
    default:"Weekly"
  },
  recurrenceDay: [
    {
      type : Number,
      required : true
    }
  ]
}, {
  timestamps: true,
});


 taskSchema.method({
  transform() {
    const transformed = {}; 
    const fields = ['id', 'companyId', 'siteId', 'workOrderNo','title','startDate','endDate','taskLogs', 'timeDue', 'description','assignedUser' , 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


 taskSchema.statics = {
  async get(id) {
    let task;

    if (mongoose.Types.ObjectId.isValid(id)) {
      task = await this.findById(id)
      .populate([
        {
          path: 'taskLogs',
          model: 'TaskLogs'
        },
        {
          path : 'siteId',
          model : 'Site'
        },
        {
          path : 'companyId',
          model : 'Company'
        },
        {
          path : 'assignedUser',
          model : 'User'
        }
      ])
      .exec();
    }
    if (task) {
      return task;
    }

    throw new APIError({
      message: 'Task does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  async list({
    page = 1, perPage = 25, companyId, siteId,taskDate,timeDue, startDate, endDate
  }) {
    var options = {};

    if(companyId){
      options['companyId'] = ObjectId(companyId);
    }
    if(siteId){
      options['siteId'] = ObjectId(siteId);
    }
    if(taskDate){
      options['taskDate'] = {$gte : new Date(taskDate) , $lte : new Date(taskDate)};
    }
    if(startDate){
      options['taskDate'] = {$gte : new Date(startDate)};
    }
    if(endDate){
      options['taskDate'] = {$lte : new Date(endDate)};
    }
    if(timeDue){
      options['timeDue'] = timeDue ;
    }

    
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
            groupId : "$groupId",
          },
          tasks : {
            $push : "$$ROOT"
          }
        }
      },
    ]).skip(perPage * (page - 1)).limit(perPage).exec()

     let populateQuery =  [
      {
        path : 'tasks.siteId',
        model : 'Site',
        select : 'name'
      },
      {
        path : 'tasks.companyId',
        model : 'Company',
        select : 'name'
      },
      {
        path : 'tasks.assignedUser',
        model : 'User',
        select : 'firstname lastname'
      }
    ];

    return this.populate(output,populateQuery);
  },
};
/**
 * @typedef SupportStatus
 */
module.exports = mongoose.model('Task', taskSchema, 'tasks');
   