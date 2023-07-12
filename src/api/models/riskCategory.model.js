const mongoose=require('mongoose');
const httpStatus=require('http-status');
const {omitBy,isNill}=require('lodash');
const APIError=require('../errors/api-error');

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trip:true,
    } 
},{
    timestamps:true,
});

categorySchema.method({
    transform(){
        const transformed={};
        const fields=['id','name','createdAt'];
        fields.forEach((field)=>{
            transformed[field]=this[field];
        })
        return transformed;
    }
})

categorySchema.statics={
 /**rs
     * Get user
     * 
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id){
        let category;
        if(mongoose.Types.ObjectId,isValid(id)){
            category = await this.findById(id).exec();
        }
        if(category){
            return category;
        }
        throw new APIError({
            message:"Category Does Not Exist",
            status:httpStatus.Not_Found
        })
    },

   
  list({
    page=1,perPage=30,name,
  }){
    const option=omitBy({name},isNill);
    return this.find(option)
    .sort({createdAt:-1})
    .skip(perPage*(page-1))
    .limit(perPage)
    .exec();
  }

}

module.exports=mongoose.model('RiskCategory',categorySchema);