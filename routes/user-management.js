const express = require('express');
const UserRouter = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const Blog = require('../models/blog');
UserRouter.use("/",require("../Middleware/authmidlleware"));
UserRouter.post('/user/follow', async (req, res) => {
    try
    {
        const tofollow = await User.findOne({username:req.body.username});
        if(!tofollow)
        {
            return res.status(404).json({message:"user not found"});
        }
        const curruser = await User.findOne({email:req.body.email});
        if(!curruser)
        {
            return res.status(404).json({message:"user not found"});
        }
        if(curruser.email === tofollow.email)
        {
            return res.status(404).json({message:"you cannot follow yourself"});
        }
        const isfollowing = curruser.following.find((user) => user.email === tofollow.email);
        if(isfollowing)
        {
            return res.status(404).json({message:"you are already following this user"});
        }
        const isfollower = tofollow.followers.find((user) => user.email === curruser.email);
        if(isfollower)
        {
            return res.status(404).json({message:"you are already following this user"});
        }
        curruser.following.push({email:tofollow.email,username:tofollow.username});
        tofollow.followers.push({email:curruser.email,username:curruser.username});
        tofollow.notifications.push(curruser.username+" started following you");
        await curruser.save();
        await tofollow.save();
        res.status(200).json({message:"followed"});

    }
    catch(error)
    {
        res.status(500).json({error:error.message});
    }
});
UserRouter.get("/user/followers",async(req,res)=>{
    const email=req.body.email;
    const user=await User.findOne({email:email});
    if(!user)
    {
        return res.status(404).json({message:"user not found"});
    }
    const followers=user.followers;
    res.status(200).json({followers:followers});
});
UserRouter.get("/user/following",async(req,res)=>{
    const email=req.body.email;
    const user=await User.findOne({email:email});
    if(!user)
    {
        return res.status(404).json({message:"user not found"});
    }
    const following=user.following;
    res.status(200).json({following:following});
}
);
UserRouter.get("/user/notifications",async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user)
    {
        return res.status(404).json({message:"user not found"});
    }
    const notifications=user.notifications;
    res.status(200).json({notifications:notifications});


});
UserRouter.get("/user/feed",async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    
        try{
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
    
        const following = user.following;
        const emails = following.map(followedUser => followedUser.email);
    
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
    
        const blogs=await Blog.find({ email: { $in: emails } })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.status(200).json({blogs:blogs});
        }
    catch(error)
    {
        res.status(500).json({error:error.message});
            
    }


});
module.exports = UserRouter;