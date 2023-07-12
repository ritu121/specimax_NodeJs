const httpStatus = require('http-status');
const { omit } = require('lodash');
const exceljs = require('exceljs');
const multer = require('multer');
const moment = require('moment-timezone')

const Role = require('../models/admin.roles.model');
const Permission = require('../models/admin.modules');

exports.removePermissions = async(req, res) => {
  const users = await Role.find({});
  const permissions = await Permission.find({});
  var arr = [];
  for(var i = 0; i < users.length; i++){
    for(var k = 0; k < users[i].permissions.length; k++){
        for(var j = 0; j < permissions.length; j++){
            // console.log('ONE',permissions[j]._id)
            // console.log('TWO',users[i].permissions[k])
            // console.log('------------------------------')
            // let userPermissions = user[i].permissions;
            if(permissions[j]._id == users[i].permissions[k]){
                // console.log('LOOP',users[i].permissions[k])
                await  arr.push(users[i].permissions[k]);
            }
        }
    }
    // let done = await Role.updateOne({_id : users[i]._id},{permissions : arr})
    // console.log('ARRAY --------', arr)
  }
  res.send({msg : 'Deleted successfully'})
};


