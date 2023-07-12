const httpStatus=require('http-status');
const {omit}=require('lodash');
const Category =require('../models/riskCategory.model');


exports.load=async(req,res,next,id)=>{
        try{
            const logs=await Category.get(id);
            req.locals={logs};
            return next();
        }catch(error){
            return next(error);
        }
}    

exports.get=(req,res)=>res.json({
    code:200,
    message:"Risk Category retrived sccessfully",
    data:req.locals.logs.transform()
})

exports.create=async(req,res,next)=>{
    try{
        const Category = new Category(req.body);
        const saveCategory = await Category.save();
        res.status(httpStatus.CREATED);
        res.json({
            code:201,
            message:"Risk Category Added Sccessfully",
            data:saveCategory.transform()
        });
    }catch(error){
        next(error);
    }
}

exports.list=async(req,req,next)=>{
    try {
        const category=await Category.list(req.query);
        res.json({
            code:200,
            message:"Risk Category List retrieved successfully",
            data:category
        })
    } catch (error) {
        next(error)
    }
}

exports.update=(req,res,next)=>{
    const updateCategory=omit(req.body);
    const Category=Object.assign(req.locals.logs,updateCategory);

    Category.save()
    .then((data)=>{
        res.json({
            code:200,
            message:"Risk Category Updated Sccessfully",
            data:data.transform()
        })
    })
    .catch((e)=>next(e))  
}

exports.remove=(req,res,next)=>{
    const {logs}=req.locals;
    logs.remove()
    .then(()=>res.json({
            code:200,
            message:"Risk Assessment Deleted Successfully"
        })
    )
    .catch((e)=>next(e));
}