
const httpStatus = require('http-status');
const { omit } = require('lodash');
const Site = require('../../models/site.model');
const User = require('../../models/user.model');
const Shift = require('../../models/shift.model');
const Reports = require('../../models/report.type.model');
const ShiftLogs = require('../../models/shift.logs.model');
const { omitBy, isNil } = require('lodash');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;



exports.adminDashboard = async (req, res, next) => {
    console.log('I am here')
    let liveView = {}
    var options = {} 
    const {companyId} = req.query;
    if(req.user.login_as === 'CLIENT' || req.user.login_as === 'COMPANY_CLIENT' || req.user.login_as === 'COMPANY_USER'){
        options = omitBy({ 'companyId' : ObjectId(companyId), _id : {$in : req.user.sites} }, isNil);
    }
    else{
        if(companyId){
            options = omitBy({ 'companyId' : ObjectId(companyId)}, isNil);
        }
    }

    let sites = await Site.aggregate([
        { $match: options },
        {
            $lookup: {
                "from": "checkpoints",
                "localField": "_id",
                "foreignField": "siteId",
                "as": "checkpoints",
            }
        },
        {
            $addFields:{
                totalCheckpoints:{
                    $size:"$checkpoints"
                },
                fireAlarm:0,
                incident:0,
                hazard:0,
                guards:3,
                breakIns:0,
            }
        },
        {
            $project:
            {   
                checkpoints:0
            }
        }
    ])

    const populateQuery = [
        {
            path: 'country',
            select: '_id  name',
        },
        {
            path: 'city',
            select: '_id  name',
        },
        {
            path: 'companyId',
            select: '_id  name',
        },
        
    ];

    sites = await Site.populate(sites, populateQuery);
   
    

    for(let i=0;i<sites.length;i++){
        let data = sites[i].team.length;
        console.log('sites',data)
        let allReports = await Reports.find({siteId:sites[i]._id, reportTypeId : {$in : ['63de643044b3381cb833abe8', '63de643044b3381cb833abe3','63de643044b3381cb833abe4']}});

        let breakReport = allReports.map((item) => {
            if(item.reportTypeId === '63de643044b3381cb833abe8'){
                return item
            }
        })

        let fire = allReports.map((item) => {
            if(item.reportTypeId === '63de643044b3381cb833abe3'){
                return item
            }
        })

        let incident = allReports.map((item) => {
            if(item.reportTypeId === '63de643044b3381cb833abe4'){
                return item
            }
        })
        sites[i].guards=data
        sites[i].breakIns=breakReport ? breakReport.length : 0
        sites[i].fireAlarm=fire ? fire.length :0
        sites[i].incident=incident ? incident.length  : 0
    }

    res.json({ code: 201, message: 'Site list retrieved successfully.', data: sites });

}
