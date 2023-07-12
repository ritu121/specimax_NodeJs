const httpStatus = require('http-status');
const Permissions = require('../../models/admin.roles.model');
const { omit } = require('lodash');

exports.load = async (req, res, next, id) => {
    try {
        const site = await Permissions.get(id);
        req.locals = { site };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.get = (req, res) => res.json({ code: 200, message: 'Roles list retrieved successfully.', data: req.locals.site.transform() });

exports.list = async (req, res, next) => {
    try {
        const faqs = await Permissions.list(req.query);
        const transformedFaqs = faqs.map((faq) => faq.transform());
        res.json({ code: 200, message: 'Roles list retrieved successfully.', data: transformedFaqs });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const faq = new Permissions(req.body);
        const savedFaq = await faq.save();
        res.status(httpStatus.CREATED);
        res.json({ code: 201, message: 'Roles added successfully.', data: savedFaq.transform() });
    } catch (error) {
        next(error);
    }
};
exports.update = (req, res, next) => {
    const updatedTask = omit(req.body);
    const task = Object.assign(req.locals.site, updatedTask);
  
    task.save()
      .then(async(task) => {
        await Permissions.findById(req.params.taskId)
          .populate([
          ])
          .then((data) => {
            res.json({code: 200, message: 'Roles updated successfully.', data: data});
          })
          .catch((error) => {
            res.json({code: 500, message: 'Internal server error.', errors : error});
          })
      })
      .catch((e) => next(e));
  };

  exports.remove = (req, res, next) => {
    const { site } = req.locals;
  
    site.remove()
    .then(() => res.json({code : 200, message : 'Role delete successfully.', data : {}}))
      .catch((e) => next(e));
  };
  