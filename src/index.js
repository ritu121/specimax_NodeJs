Promise = require('bluebird'); 
const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const cron = require("node-cron");
const Shift = require('./api/models/site.roster.model');
const Alarm = require('./api/models/alarm.model');
// const Shift = require('./api/models/shift.model');
// const User = require('./api/models/user.model');
// const Duty = require('./api/models/key.shift.duties.model');
const Notification = require('./api/models/notification.model');
const {formatCurrentDate, formatDate, convertTime12to24, timeToMilliseconds, sentPushNotification, formatAMPM} = require('./api/utils/helper.js')
mongoose.connect();

// notifications & shift start time and end time alert at every 1 minute
// cron.schedule("*/1 * * * *", async function() {
//     let alerts = await Notification.find({
//     }).populate('userId');
//     let shifts = await Shift.find({assignedUser : {$ne : null}, shiftDate : {$gte : new Date(), $lte : new Date()}}).populate('assignedUser shiftId');
//     for (let i = 0; i < alerts.length; i++) {
//             if(alerts[i].userId){
//                 var todayDate = new Date();
//                 // todayDate = todayDate.getTime();
//                 // var today = new Date();
//                 var shiftDate = new Date(alerts[i].shiftDate);
//                 // var fromDate = new Date(alerts[i].shiftDate);
//                 // fromDate = fromDate.getTime();
         
//                 var last2car = alerts[i].startTime.slice(-2);
//                 var first5car = alerts[i].startTime.slice(0,5);
//                 var startTime = timeToMilliseconds(convertTime12to24(`${first5car} ${last2car}`));
//                 var currentTime = timeToMilliseconds(convertTime12to24(formatAMPM(todayDate)))

//                 if(startTime === currentTime && todayDate.setHours(0,0,0,0) == shiftDate.setHours(0,0,0,0)){
//                     if(alerts[i].userId !== null && alerts[i].userId._id !== undefined && alerts[i].userId.deviceToken !== null && alerts[i].userId.deviceToken.length > 100)
//                     {
//                         sentPushNotification('Alert', alerts[i].notification, alerts[i].userId.deviceToken);
//                     }
//                 }
//             }  
//     }

//     for (let i = 0; i < shifts.length; i++) {

//             if(shifts[i].assignedUser && shifts[i].siteId){
//                 var todayDate = new Date();
//                 var shiftDate = new Date(shifts[i].shiftDate);
//                 var last2car = shifts[i].startTime.slice(-2);
//                 var first5car = shifts[i].startTime.slice(0,5);

//                 var last2carEnd = shifts[i].endTime.slice(-2);
//                 var first5carEnd = shifts[i].endTime.slice(0,5);

//                 var startTime = timeToMilliseconds(convertTime12to24(`${first5car} ${last2car}`));
//                 var endTime = timeToMilliseconds(convertTime12to24(`${first5carEnd} ${last2carEnd}`));
//                 var currentTime = timeToMilliseconds(convertTime12to24(formatAMPM(today)))
                
//                 if(startTime === currentTime && todayDate.setHours(0,0,0,0) == shiftDate.setHours(0,0,0,0))
//                {
//                     if(shifts[i].assignedUser !== null && shifts[i].assignedUser.deviceToken !== '' && shifts[i].assignedUser.deviceToken !== undefined && shifts[i].assignedUser.deviceToken !== null && shifts[i].assignedUser.deviceToken.length > 100)
//                     {
//                     sentPushNotification('Shift Alert', `Your ${shifts[i].siteId.name} site shift has been started`, user.deviceToken);
//                     }
//                 }
//                 if(endTime === currentTime && todayDate.setHours(0,0,0,0) == shiftDate.setHours(0,0,0,0))
//                 {
//                      if(shifts[i].assignedUser !== null && shifts[i].assignedUser.deviceToken !== '' && shifts[i].assignedUser.deviceToken !== undefined && shifts[i].assignedUser.deviceToken !== null && shifts[i].assignedUser.deviceToken.length > 100)
//                      {
//                      sentPushNotification('Shift Alert', `Your ${shifts[i].siteId.name} site shift has been ended`, user.deviceToken);
//                      }
//                 }
           
//             }
//     }

//     let alarms = await Alarm({dueDate : {$gte : new Date(), $lte : new Date}}).populate([
//         {
//             path : 'company',
//             model : 'Company'
//           },
//           {
//             path : 'sites',
//             model : 'Site'
//           },
//           {
//             path : 'user',
//             model : 'User'
//           }
//     ]);
//     for(let j = 0; j < alarms.length; j++){
//         var last2car = alarms[j].dueTime.slice(-2);
//         var first5car = alarms[j].dueTime.slice(0,5);
//         var dueDate = new Date(alarms[j].dueDate);
//         var today = new Date();
//         var start = timeToMilliseconds(convertTime12to24(`${first5car} ${last2car}`));
//         var current = timeToMilliseconds(convertTime12to24(formatAMPM(today)))
//         if(start === current && today.setHours(0,0,0,0) == dueDate.setHours(0,0,0,0)){
//             if(alarms[j].user.deviceToken !== '' && alarms[j].user.deviceToken.length > 68){
//                 sentPushNotification(alarms[j].title, alarms[j].description, alarms[j].user.deviceToken);
//             }
//         }
//     }
// });

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
module.exports = app;
