const httpStatus = require('http-status');
const Permissions = require('../../models/admin.modules');

exports.load = async (req, res, next, id) => {
    try {
        const site = await Permissions.get(id);
        req.locals = { site };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.get = (req, res) => res.json({ code: 200, message: 'Faq list retrieved successfully.', data: req.locals.site.transform() });

exports.list = async (req, res, next) => {
    try {
        
        const faqs = await Permissions.find({});
        const transformedFaqs = faqs.map((faq) => faq.transform());
        res.json({ code: 200, message: 'Modules list retrieved successfully.', data: transformedFaqs, count : faqs.length });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const permission = await Permissions.findOne({name : req.body.name});
        if(permission){
           res.status(400).send({code: 400, message: 'Permission already exist.'})
        }
        else{
            const faq = new Permissions(req.body);
            const savedFaq = await faq.save();
            res.status(httpStatus.CREATED);
            res.json({ code: 201, message: 'Permission added successfully.', data: savedFaq.transform() });
        }
        
    } catch (error) {
        next(error);
    }
};
