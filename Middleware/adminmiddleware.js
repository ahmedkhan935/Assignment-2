const User=require("../models/user");
async function adminrole(req, res, next) {
    const email=req.body.email;
    const user=await User.findOne({email:email}); 
    if(user.role!="admin")
    {
        return res.status(400).json({message:"You are not an admin"});
    }
    next();
}
module.exports = adminrole;