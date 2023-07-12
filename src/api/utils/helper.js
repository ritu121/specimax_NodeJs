// var FCM = require("fcm-node");
const path = require('path');
var admin  = require('firebase-admin')
var fcm = require('fcm-notification')
var serviceAccount = require('./push-notification-key.json')
const certPath = admin.credential.cert(serviceAccount)
var FCM = new fcm(certPath)

require('dotenv-safe').config({
  path: path.join(__dirname, '../../../.env'),
  example: path.join(__dirname, '../../../.env.example'),
});


function sentPushNotification(title, body, deviceToken, key = 'Roster'){
   try{
    let message  = {
        notification :{
          title : title,
          body : body,
          // sound : 'ping.aiff',
        },
        data : {
        
        },
        token : deviceToken
    };
    FCM.send(message, function(err, resp){
      if(err){
        console.log('Error @@@@', err)
      }
      if(resp){
        console.log('Response @@@@', resp)
      }
    })
   }
   catch(err){
     console.log('Run Error @@@@', err)
   }
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function getDateRange(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(new Date (currentDate));
      currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function uniqueMergeArray(arr1, arr2){
  // merge two arrays
  let arr = arr1.concat(arr2);
  let uniqueArr = [];
  // loop through array
  for(let i of arr) {
      if(uniqueArr.indexOf(i) === -1) {
          uniqueArr.push(i);
      }
  }
  return uniqueArr;
}

function formatDate (raw){
   let date = new Date(raw)
   return (date.getDate().length === 1 ? `0${date.getDate()}`:date.getDate()) + '-' + ((date.getMonth() + 1).length === 1 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1))  + '-' + date.getFullYear();
}


function formatRawDate (raw){
  let date = new Date(raw)
  // return (date.getDate().length === 1 ? `0${date.getDate()}`:date.getDate()) + '-' + ((date.getMonth() + 1).length === 1 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1))  + '-' + date.getFullYear();

  return date.getFullYear() + '-' + ((date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)) + '-' + (date.getDate().toString().length === 1 ? `0${date.getDate()}`:date.getDate());
}

function formatCurrentDate (){
    let date = new Date()
    return date.getDate() + '-' + date.getMonth()  + '-' + date.getFullYear();
}

function createTime(date, time) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-') + ' ' + time;
}


function convertTime12to24 (time12h){
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}:00`;
}

function convertMsToHM(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function timeToMilliseconds(time){
    return Number(time.split(':')[0]) * 60 * 60 * 1000 + Number(time.split(':')[1]) * 60 * 1000;
}

function correctStrToTime(timeStr){
  return `${timeStr.slice(0,5)} ${timeStr.slice(-2)}`
}

 module.exports = { sentPushNotification ,formatDate, formatCurrentDate, convertTime12to24 , timeToMilliseconds, createTime, convertMsToHM,formatAMPM, getDateRange,uniqueMergeArray, correctStrToTime,formatRawDate}