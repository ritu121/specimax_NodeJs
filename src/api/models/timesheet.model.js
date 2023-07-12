// const mongoose = require('mongoose');
// const httpStatus = require('http-status');
// const { omitBy, isNil } = require('lodash');
// const APIError = require('../errors/api-error');

// const timeSheetSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   siteId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Site',
//     required: false,
//   },
//   clientId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: false,
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
//   employer: {
//     type: String,
//     required: true,
//   },
//   notes: {
//     type: String,
//     required: false,
//   },
//   totalHours: {
//     type: Number,
//     // required: true,
//   },
//   // clock: {
//   //   type: Array,
//   //   default: []
//   // },
//   clock:[
//     {
//       startDateTime : {
//         type :Date,
//         required : true
//       },
//       endDateTime : {
//         type :Date,
//         required : true
//       },
//       actualStartDateTime : {
//         type :Date,
//         required : true
//       },
//       actualEndDateTime : {
//         type :Date,
//         required : true
//       },
//       break :{
//         type : Number,
//         default : 0
//       },
//       totalTime : {
//         type : Number,
//         default : 0
//       }
//     }
//   ],
//   actionBy :{
//    type : mongoose.Schema.ObjectId,
//    ref : 'User',
//    default : null
//   },
//   approvedNotes: {
//     type: String,
//     required : false
//   },
//   statusId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'TimesheetStatus',
//     required: true,
//     default: "62a8eb3bfc9fbe1ba86e134d"
//   },
// }, {
//   timestamps: true,
// });


// timeSheetSchema.method({
//   transform() {
//     const transformed = {};
//     const fields = ['id', 'userId', 'siteId','clientId','actionBy', 'startTime', 'endTime', 'approvedNotes','statusId', 'totalHours', 'clock', 'createdAt'];

//     fields.forEach((field) => {
//       transformed[field] = this[field];
//     });

//     return transformed;
//   },
// });


// timeSheetSchema.statics = {
//   async get(id) {
//     let timesheet;

//     if (mongoose.Types.ObjectId.isValid(id)) {
//       timesheet = await this.findById(id)
//         .populate([
//           {
//             path: 'userId',
//             model: 'User',
//             select: 'firstname lastname'
//           },
//           {
//             path: 'siteId',
//             model: 'Site',
//             select: 'name'
//           },
//           {
//             path: 'clientId',
//             model: 'User',
//             select: 'firstname lastname'
//           },
//           {
//             path: 'actionBy',
//             model: 'User',
//             select: 'firstname lastname'
//           },
//           {
//             path: 'statusId',
//             model: 'TimesheetStatus',
//             select: 'name'
//           },
        
//         ])
//         .exec();
//     }
//     if (timesheet) {
//       return timesheet;
//     }

//     throw new APIError({
//       message: 'Timesheet does not exist',
//       status: httpStatus.NOT_FOUND,
//     });
//   },


//   list({
//     page = 1, perPage = 30, startTime, endTime, siteId, userId,clientId, statusId, createdAt
//   }) {
//     const options = omitBy({ startTime, endTime, siteId, userId, statusId,clientId, createdAt }, isNil);

//     return this.find(options)
//       .populate([
//         {
//           path: 'userId',
//           model: 'User',
//           select: 'firstname lastname'
//         },
//         {
//           path: 'siteId',
//           model: 'Site',
//         },
//         {
//           path: 'clientId',
//           model: 'User',
//         },
//         {
//           path: 'actionBy',
//           model: 'User',
//         },
//         {
//           path: 'statusId',
//           model: 'TimesheetStatus',
//         },
//       ])
//       .sort({ createdAt: -1 })
//       .skip(perPage * (page - 1))
//       .limit(perPage)
//       .exec();
//   },
// };

// module.exports = mongoose.model('Timesheet', timeSheetSchema);

const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
/**
 * User Schema
 * @private
 */
const timeSheetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  siteId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Site',
    required: false,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },

  totalHours: {
    type: Number,
    // required: true,
  },
  clock: {
    type: Array,
    default: {}
  },
  approvedNotes: {
    type: String
  },
  statusId: {
    type: mongoose.Schema.ObjectId,
    ref: 'TimesheetStatus',
    required: true,
    default: "62a8eb3bfc9fbe1ba86e134d"
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
timeSheetSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'userId', 'siteId', 'startTime', 'endTime', 'statusId', 'totalHours', 'clock', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
timeSheetSchema.statics = {
  /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
  async get(id) {
    let timesheet;

    if (mongoose.Types.ObjectId.isValid(id)) {
      timesheet = await this.findById(id)
        .populate([
          {
            path: 'userId',
            model: 'User',
            select: 'firstname lastname'
          },
          {
            path: 'siteId',
            model: 'Site',
          },
          {
            path: 'statusId',
            model: 'TimesheetStatus',
          },
        ])
        .exec();
    }
    if (timesheet) {
      return timesheet;
    }

    throw new APIError({
      message: 'Timesheet does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
  list({
    page = 1, perPage = 30, startTime, endTime, siteId, userId, statusId, createdAt
  }) {
    const options = omitBy({ startTime, endTime, siteId, userId, statusId, createdAt }, isNil);

    return this.find(options)
      .populate([
        {
          path: 'userId',
          model: 'User',
          select: 'firstname lastname'
        },
        {
          path: 'siteId',
          model: 'Site',
        },
        {
          path: 'statusId',
          model: 'TimesheetStatus',
        },
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
/**
 * @typedef Timesheet
 */
module.exports = mongoose.model('Timesheet', timeSheetSchema);
