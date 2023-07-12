const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const License = require('../../models/user.license.model');
const Experience = require('../../models/user.experience.model');
const User = require('../../models/user.model');
const Builder = require('../../services/resumeGenerator')
const url = require('url');
const fs = require('fs');
path = require('path');

exports.getLiscense = async(userId) => {
    let liscense = await License.find({ user: userId })
    return liscense;
};

exports.getExperience = async(userId)=>{
    let exp = await Experience.find({ user:userId })
    return exp;
}

exports.getAllData = async(req,res,next)=>{
    try {
        let userData = await User.find({}).populate([
            {
              path: 'experiences',
            },
          ])
          for(let i=0;i<userData.length;i++){
              userData[i].exp = await this.getExperience(userData[i]._id)
              userData[i].licenses = await this.getLiscense(userData[i]._id)
              let urlObject = url.parse(userData[i].picture||"", true);
              let profileImage = path.join(__dirname, `../../../public${urlObject.path}`);
              // userData.picture = profileImage
              Builder.generateResume(userData[i]);
              const baseUrl = `${req.protocol}://${req.headers.host}`;
              const cvpath= `${baseUrl}/cvs/${userData._id}.pdf`;
          }
        res.json({success:true,message:"File retrieved" })
    } catch (error) {
        next(error)
    }
}

exports.getData = async(req,res,next)=>{
    try {
        let userData = await User.findOne({_id:req.user._id}).populate([
            {
              path: 'experiences',
            },
          ])
        req.user.exp = await this.getExperience(req.user._id)
        req.user.licenses = await this.getLiscense(req.user._id)
        
        let urlObject = userData.picture ? url.parse(userData.picture, true) : undefined ;
        let profileImage = path.join(__dirname, `../../../public${urlObject?.path}`);
        userData.licenses = await this.getLiscense(req.user._id);
        console.log('USER DATA',await this.getLiscense(req.user._id),urlObject,userData)
        await Builder.generateResume(userData);
        // const baseUrl = `http://50.17.107.208:3004`;
        const baseUrl = `${req.protocol}://${req.headers.host}`;
        let genratedUrl = path.join(__dirname, `../../../public/cvs/${userData._id}.pdf`);
        res.download(genratedUrl, function(err) {
          if(err) {
              console.log(err);
          }
        })

        // res.json({success:true,message:"File retreived",path:cvpath})
    } catch (error) {
        next(error)
    }
}

exports.getTimesheetData = async(req,res,next)=>{
    try {
        let userData = await User.findOne({_id:req.user._id}).populate([
            {
              path: 'experiences',
            },
          ])
        req.user.exp = await this.getExperience(req.user._id)
        let liscense = await this.getLiscense(req.user._id)
        Builder.generateTimesheet(userData);
        const baseUrl = `http://50.17.107.208:3004`;
        
        const path= `${baseUrl}/timesheets/${userData._id}.pdf`;
        res.json({success:true,message:"File retreived",path:path})
    } catch (error) {
        next(error)
    }
}