const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const Vendor = require('../models/vendor.model');
const Sites = require('../models/site.model');
const APIError = require('../errors/api-error');


const apiError = new APIError({
    status : httpStatus.FORBIDDEN,
    message :'Forbidden'
    // stack: error ? error.stack : undefined,
});

exports.handlePermission =(role)=> async(req,res,next)=>{
    if(req.user.login_as=='SUPERADMIN'){
        req.user.sites = await Sites.find({})
        req.user.companyList = await Company.find({},{_id:1})
        next()
    }else if(req.user.login_as=='CLIENT' || req.user.login_as=='CLIENT_USER'){
        const company = await Company.findById(req.user.company)
                .populate(
                    {
                        path:'roleId',
                        // populate:'permissions',
                    }).exec()
        // if(!company.roleId.permissions.includes(role)){
        //     return next(apiError);
        // }
        req.user.sites = await Sites.find({companyId:req.user.company},{_id:1})
        req.user.companyList=[req.user.company]
        next()
    }else if(req.user.login_as=='VENDOR'){
        const company = await Company.findById(req.user.company)
                .populate(
                    {
                        path:'roleId',
                        // populate:'permissions',
                    }).exec()
        // if(!company.roleId.permissions.includes(role)){
        //     return next(apiError);
        // }
        let sites = await Vendor.find({vendor:req.user.company})
        req.user.sites = sites.sites
        req.user.companyList = sites.clients
        next()
    }else if(req.user.login_as=='GUARD'){
        const company = await Company.findById(req.user.company)
                .populate(
                    {
                        path:'roleId',
                        // populate:'permissions',
                    }).exec()
        // if(!company.roleId.permissions.includes(role)){
        //     return next(apiError);
        // }
        // req.user.sites = await Sites.find({companyId:req.user.company},{_id:1})
        req.user.companyList=[req.user.company]
        next()
    }else{
        next(apiError)
    }
    // next();
}