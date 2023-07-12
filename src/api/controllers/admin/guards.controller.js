const Shift = require('../../models/shift.model');
const User = require('../../models/user.model');


exports.getTeam = async(req,res,next)=>{
    // let sites = await User.find({_id:req.user.sub},{sites:1})
    let arr=[]
    let ar2=[]
    console.log('ssi',req.user.sites)
    let users = await Shift.find({siteId:req.user.sites},{userId:1}).populate([
        {
            path:'userId',
            model:'User',
            select:'-password'
        }
    ])
    for(let i=0;i<users.length;i++){
        if(!arr.includes(users[i].userId?._id)){
            ar2.push(users[i])
            arr.push(users[i].userId?._id)
        }
    }
    res.json({code: 201, message: 'Site list retrieved successfully.', data: ar2});
}