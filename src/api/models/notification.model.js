const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref : 'User',

    // trim: true,
  },
  siteId:{
    type : mongoose.Schema.ObjectId,
    ref : 'Site',
    required: true
  },
  company:{
    type : mongoose.Schema.ObjectId,
    ref : 'Company',
    required: true
  },
//   status:{
//     type: String,
//     required: false,
//     default : "Unassigned",
//   },
  notification:{
    type: String,
    required: true,
  },
//   price:{
//     type: Number,
//     required: false,
//   },
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
    default:""
  },
  endTime:{
    type:String,
    required:false,
    default:""
  },
  duration:{
    type:String,
    required:false,
    default:""
  },
  recurrenceDay:[],
  shiftRecurrence:{
    type:String,
    required:false,
    default:""
  },
  notes:{
    type:String,
    required:false,
    default:""
  },
  assignedUser:{
    type : mongoose.Schema.ObjectId,
    ref : 'User',
  },
}, {
  timestamps: true,
});


 notificationSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'userId', 'status','company','siteId', 'startDate','endDate','startTime','endTime', 'shiftRecurrence', 'shiftCode','notes','intrestedUsers', 'allowedBreaks','reportAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});


 notificationSchema.statics = {
  async get(id) {
    let choice;

    if (mongoose.Types.ObjectId.isValid(id)) {
      choice = await this.findById(id).populate([
        {
          path : 'siteId',
          model : 'Site'
        },
        {
          path : 'company',
          model: 'Company'
        }
      ]).exec();
    }
    if (choice) {
      return choice;
    }

    throw new APIError({
      message: 'Notification does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },


  list({
    page = 1, perPage = 30, status, startDate, startTime,endTime
  }) {
    const options = omitBy({ startDate }, isNil);

    return this.find(options)
      .populate([
        {
          path : 'siteId',
          model : 'Site'
        },
        {
          path : 'userId',
          model: 'User'
        },
        {
          path : 'company',
          model: 'Company'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Notification', notificationSchema);
