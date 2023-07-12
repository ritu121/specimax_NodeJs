const httpStatus = require('http-status');
const { omit } = require('lodash');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const License = require('../models/user.license.model');
const pdfGen = require('../controllers/user/invoicePdf.controller');



exports.download = async(req, res) => {
  const licenseId = req.params.licenseId;
  const license = await License.findOne({_id : licenseId}).populate('country issuingState');
  // const baseUrl = `http://50.17.107.208:3004`;
  const  baseUrl = req.protocol+"://"+req.headers.host;
  await pdfGen.generateLicense(license.licenseName?.name,license.issuingState.name,license.licenseNumber,license.country.name,license.issuingAuthority,license._id, license.picture)
  // const path= `${baseUrl}/uploads/${license._id}.pdf`;
  let licenseUrl = path.join(__dirname, `../../public/uploads/${license._id}.pdf`);
  await res.download(licenseUrl, function(err) {
    if(err) {
        console.log(err);
    }
  })
  // res.json({path})
};






