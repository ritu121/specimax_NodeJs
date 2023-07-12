const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../errors/api-error');
const uuidv4 = require("uuid/v4")

const shiftSchema = new mongoose.Schema({
  createdBy : {
    type : mongoose.Schema.ObjectId,
    ref : 'User',
  },
  casualShiftId:{
    type : mongoose.Schema.ObjectId,
    ref : 'CasualShift',
    // required: true
  },
  rosterId :{
    type : mongoose.Schema.ObjectId,
    ref : 'ShiftRoster',
    // required: true
  },
  siteId :{
    type : mongoose.Schema.ObjectId,
    ref : 'Site',
    required: true
  },
  shiftType : {
    type : String,
    enum : ['Fixed','Casual'],
    required : true,
    default : 'Fixed'
  },
  inOut:{
    type: String,
    enum:['IN','OUT',null],
    required: false,
    default : null,
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
  latitude: {
    type: String,
    required: false,
  },
  longitude: {
    type: String,
    required: false,
  },
  startTime: {
    type: String,
    default:"07:00",
    required: false,
  },
  endTime: {
    type: String,
    default:"06:00",
    required: false,
  },
  clockInTime:{
    type:Date,
    required:false,
    default:null
  },
  clockOutTime:{
    type:Date,
    required:false,
    default:null
  },
  shiftCode:{
    type:String,
    required:false,
  },
  contact:{
    type:String,
    default:"",
    required:false,
  },
  breaks:[{
    type : mongoose.Schema.ObjectId,
    ref : 'Break',
    required:false
  }],
  isGroup:{
    type: Boolean,
    default: false,
    required:false,
  },
  groupId:{
    type: String,
    default : uuidv4(),
    required:true,
  },
  assignedUser:{
    type: mongoose.Schema.ObjectId,
    ref : 'User',
    default : null,
  },
  status:{
    type: String,
    enum : ['Reassign','Approved','Unassigned','Cancel','In Process'],
    default : null,
  }
}, {
  timestamps: true,
});


 shiftSchema.method({
  transform(date) {
    const transformed = {};
    const fields = ['id', 'userId','startTime','status','assignedUser','rosterId','contact','endTime', 'inOut','siteId','casualShiftId' ,'shiftDate','clockInTime','clockOutTime','startDate','endDate' ,'latitude', 'longitude','breaks','createdBy', 'groupId','isGroup','createdAt'];
    
    fields.forEach((field) => {
      if(field=='shiftDate' && date){
        transformed[field] = date; 
      }else
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
          path : 'siteId',
          model : 'Site'
        },
        // {
        //   path : 'assignedUser',
        //   model : 'User'
        // },
        {
          path : 'breaks',
          model : 'Break'
        },
        {
          path : 'casualShiftId',
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
    page = 1, perPage = 30, inOut, shiftDate, userId
  }) {
    const options = omitBy({ inOut, userId }, isNil);
    options['startDate']={$lte:shiftDate}
    options['endDate']={$gte:shiftDate}
    return this.find(options)
      .populate([
        {
          path : 'siteId',
          model : 'Site'
        },
        {
          path : 'assignedUser',
          model : 'User'
        },
        {
          path : 'createdBy',
          model : 'User'
        },
        {
          path : 'breaks',
          model : 'Break'
        },
        {
          path : 'casualShiftId',
          select: {'startTime':1,endTime:1,userId:1},
          populate:{
            path : 'userId',
            model:'User',
            match:{'startTime':{$gte:shiftDate}}
            // select: {'startTime':1,endTime:1}
          }
        },
        // {
        //   path : 'casualShiftId.userId',
        //   model:'User',
        //   // select: {'startTime':1,endTime:1}
        // }
      ])
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Shift', shiftSchema);
