const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');

const shiftSchema = new mongoose.Schema({
  companyId:{
    type : mongoose.Schema.ObjectId,
    ref : 'Company',
    required: true
  },
  siteId:{
    type : mongoose.Schema.ObjectId,
    ref : 'Site',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref : 'User',
  },
 
  shiftType:{
    type:mongoose.Schema.ObjectId,
    ref:'ShiftType'
  },
  price:{
    type: Number,
    required: true,
  },
  priceIn:{
    type: String,
    required: true,
    default : 'USD'
  },
  shiftDate: {
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
  recurrenceType:{
    type: String,
    enum: ['Weekly', 'Monthly','Yearly'],
    default : 'Weekly'
  },
  recurrenceDay :[
   {
    type : Number,
    required : true
   }
  ],
  shiftCode:{
    type:String,
    required:true,
  },
  woNumber:{
    type:String,
    required:true,
  },
  allowedBreaks:{
    type : Number,
    default:null
  },
  reportAt:{
    type : mongoose.Schema.ObjectId,
    ref: 'Site',
    required : true
  },
  parkingRequired:{
    type : Boolean,
    default:false
  },
  intrestedUsers:[{
    type : mongoose.Schema.ObjectId,
    ref : 'User',
  }],
  assignedUser:{
    type : mongoose.Schema.ObjectId,
    ref : 'User',
  },
  status:{
    type: String,
    required: false,
    enum : ['Reassign','Approved','Cancel','Unassigned','Assigned','In Process'],
    default : "Unassigned",
  },
  isGroup:{
    type: Boolean,
    default: false,
    required:false,
  },
  groupId:{
    type: String,
    required:true,
  },
  licenseType:{
    type: mongoose.Schema.ObjectId,
    required:true,
  },
}, {
  timestamps: true,
});


 shiftSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'status','siteId','companyId','parkingRequired', 'shiftType','price','startDate','endDate','startTime','endTime', 'shiftRecurrence', 'shiftCode','woNumber','intrestedUsers','assignedUser', 'allowedBreaks','reportAt','recurrenceType','recurrenceDay','createdAt','createdBy','licenseType','priceIn'];

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
          path : 'companyId',
          model : 'Company'
        },
        {
          path : 'siteId',
          model : 'Site',
          populate :[ 
          {
            path : 'companyId'
          },
          {
            path : 'city'
          },
          {
            path : 'country'
          },
        ]
        },
        {
          path : 'shiftType',
          model : 'ShiftType'
        },
        {
          path : 'assignedUser',
          model : 'User'
        },
        {
          path : 'reportAt',
          model : 'Site'
        },
        {
          path : 'licenseType',
          model : 'LicenseType'
        },
        {
          path : 'createdBy',
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


  async list({
    page = 1, perPage = 30, status, startDate,endDate, startTime,endTime
  }) {
    const options = omitBy({ status, startDate, endDate, startTime, endTime}, isNil);
    let output = await this.aggregate([
      {
        $skip : perPage * (page - 1)
      },
      {
        $limit : perPage
      },
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
            // isRecurrence : "$isRecurrence",
            groupId : "$groupId",
            // recurrenceId : "$recurrenceId"
          },
          // {
          //   groupId : "$groupId", 
          //   startDate : "$startDate", 
          //   endDate : '$endDate',
          //   startTime : "$startTime",
          //   endTime : "$endTime",
          //   companyId : "$companyId",
          //   siteId : "$siteId",
          //   assignedUser : "$assignedUser",
          //   recurrenceType :"$recurrenceType",
          //   recurrenceDay : "$recurrenceDay",
          //   allowedBreaks : "$allowedBreaks",
          //   reportAt : "$reportAt",
          //   parkingRequired : "$parkingRequired",
          //   intrestedUsers : "$intrestedUsers",
          //   status : "$status",
          //   isGroup : "$isGroup",
          //   shiftType : "$shiftType",
          //   woNumber : "$woNumber",
          //   _id : "$_id",
          //   price : "$price",
          //   userId : "$userId",
          //   shiftCode : "$shiftCode",
          //   createdAt : "$createdAt",
          //   updatedAt : "$updatedAt"
          // },
          shifts : {
            $push : "$$ROOT"
          }
        }
      },
    ]).exec()

     let populateQuery =  [
        {
          path : 'shifts.companyId',
          model : 'Company',
          select: "name"
        },
        {
          path : 'shifts.siteId',
          model : 'Site',
          select: "name",
          populate :[ 
            {
              path : 'companyId',
              select: "name"
            },
            {
              path : 'city',
              select: "name"
            },
            {
              path : 'country',
              select: "name"
            }
          ]
        },
        {
          path : 'shifts.shiftType',
          model : 'ShiftType',
          select: "name"
        },
        {
          path : 'shifts.reportAt',
          model : 'Site'
        },
        {
          path : 'shifts.licenseType',
          model : 'LicenseType'
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
    // return this.find(options)
    //   .populate([
    //     {
    //       path : 'companyId',
    //       model : 'Company'
    //     },
    //     {
    //       path : 'userId',
    //       model : 'User'
    //     },
    //     {
    //       path : 'siteId',
    //       model : 'Site',
    //       populate :[ 
    //         {
    //           path : 'companyId'
    //         },
    //         {
    //           path : 'city'
    //         },
    //         {
    //           path : 'country'
    //         }
    //       ]
    //     },
        
    //     {
    //       path : 'shiftType'
    //     },
    //     {
    //       path : 'assignedUser',
    //       select: "firstname lastname"
    //     },
    //   ])
    //   .sort({ createdAt: -1 })
    //   .skip(perPage * (page - 1))
    //   .limit(perPage)
    //   .exec();
  },
};

module.exports = mongoose.model('CasualShift', shiftSchema,'casual_shifts');
