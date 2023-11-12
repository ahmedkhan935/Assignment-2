const express = require('express');
const Searchrouter = express.Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
dotenv.config();
Searchrouter.use("/",require("../Middleware/authmidlleware"));
Searchrouter.get("/search",async(req,res)=>{
    const keyword=req.query.keyword || [ ];
    const category=req.query.category || "";
    const author=req.query.author || "";
    const sortBy=req.query.sortBy || "createdAt";
    const sortOrder=req.query.sortOrder || "desc";
    const query={};
    if(category){
        query.category=category;
    }
    if(author){
        const user=await User.findOne({username:author});
        if(user){
            query.author=user.email;
        }
    }
    if(keyword.length>0){
        query.$or=[
            {title:{$in:keyword}},
            {content:{$in:keyword}}
        ]
    }
    const sort={};
    sort[sortBy]=sortOrder;
    try{
        const blogs=await Blog.find(query).sort(sort);
        res.json(blogs);
    }catch(err){
        res.json({message:err});
    }

    

    

});
module.exports = Searchrouter;