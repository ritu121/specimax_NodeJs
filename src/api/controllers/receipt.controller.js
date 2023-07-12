const httpStatus = require('http-status');
const { omit } = require('lodash');
const Receipt = require('../models/receipt.model');
const getPdf = require('./user/invoicePdf.controller')

exports.getPdf = async(req,res,next)=>{
    await getPdf.createPdf()
    res.json({status:true});
}

exports.createReceipt = async(req,res,next)=>{
    req.body.userId = req.user._id
    this.generateReport(req.body)
    res.json({status:true});
}

exports.generateReport = async(data)=>{
    data.invoiceNo = 'INV_'+(Math.random() * (10000000 - 100) + 100)
    const baseUrl = `http://50.17.107.208:3004`;

    data.media= `${baseUrl}/uploads/${data.invoiceNo}.pdf`;

    let rec = new Receipt(data)
    let savedRec = await rec.save();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date();
    await getPdf.createPdf(data.email,data.amount,date.toLocaleDateString("en-US", options),data.invoiceNo)
    return true;
}

exports.list = async (req, res, next) => {
    try {
      req.query.userId = req.user._id
      const receipt = await Receipt.list(req.query);
    //   const transformedShifts = shifts.map((status) => { });
      res.json({ code: 200, message: 'Receipt list retrieved successfully.', data: receipt });
    } catch (error) {
      next(error);
    }
};
