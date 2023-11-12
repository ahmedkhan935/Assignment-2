const express = require('express');
const Blogsrouter = express.Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
dotenv.config();
Blogsrouter.use("/",require("../Middleware/authmidlleware"));
Blogsrouter.post('/blogs', async (req, res) => {
   
  try {
      const blog = new Blog({
        email: req.body.email,
        title: req.body.title,
        text: req.body.text,
        category: req.body.category,
        active: true,
        comments: [],
        ratings: [],
        

      });
      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  Blogsrouter.get('/blogs', async (req, res) => {
    try {
      
      const page = parseInt(req.params.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 
      const filter = req.query.filter || '';
  
    
      const filterObj = filter ? { title: { $regex: filter, $options: 'i' },active:true } : {active:true};
  
      const skip = (page - 1) * limit; 
  
      const totalItems = await Blog.countDocuments(filterObj); 
  
      const blogs = await Blog.find(filterObj)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by creation date in descending order
  
      res.json({
        blogs,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  Blogsrouter.get('/blogs/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if(blog.active==false)  return res.status(404).json({message:"Blog not found"});
      if(!blog)
      {
        return res.status(404).json({message:"Blog not found"});
      }
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  Blogsrouter.put('/blogs/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if(blog.active==false)  return res.status(404).json({message:"Blog not found"});
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      if (blog.email !== req.body.email) {
        return res.status(403).json({ message: 'You are not authorized to update this blog' });
      }
  
      blog.title = req.body.title;
      blog.text = req.body.text;
  
      await blog.save();
      res.json(blog);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  Blogsrouter.delete('/blogs/:id', async (req, res) => {
    try {
      
      const blog = await Blog.findById(req.params.id);
      if(blog.active==false)  return res.status(404).json({message:"Blog not found"});

  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      if (blog.email !== req.body.email) {
        return res.status(403).json({ message: 'You are not authorized to delete this blog' });
      }
  
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Blog deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  Blogsrouter.post('/blogs/:id/comments', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if(blog.active==false)  return res.status(404).json({message:"Blog not found"});
      const user=await User.findOne({email:blog.email});

  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      blog.comments.push({
        email: req.body.email,
        text: req.body.text,
      });
        user.notifications.push(req.body.email+" commented on your blog");
    
  
      await blog.save();
        await user.save();
      res.status(201).json(blog.comments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  Blogsrouter.delete('/blogs/:id/comments/:commentId', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if(blog.active==false)  return res.status(404).json({message:"Blog not found"});
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      const comment = blog.comments.find((comment) => comment.id === req.params.commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (comment.email !== req.body.email) {
        return res.status(403).json({ message: 'You are not authorized to delete this comment' });
      }
  
      blog.comments = blog.comments.filter((comment) => comment.id !== req.params.commentId);
  
      await blog.save();
      res.json(blog.comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
    Blogsrouter.get('/blogs/:id/comments', async (req, res) => {
        try {
        const blog = await Blog.findById(req.params.id);
        if(blog.active==false)  return res.status(404).json({message:"Blog not found"});

    
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
    
        res.json(blog.comments);
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    });
    Blogsrouter.post("/blogs/:id/ratings", async (req, res) => {
        try {
          const blog = await Blog.findById(req.params.id);
          if(blog.active==false)  return res.status(404).json({message:"Blog not found"});
          if(req.body.rating<1||req.body.rating>5){
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
          }
      
          if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
          }
          blog.ratings.forEach((element) => {
            if(element.email==req.body.email){
              element.rating=req.body.rating;
              return res.status(201).json(blog.ratings);
            }
            }
            );

      
            blog.ratings.push({
            email: req.body.email,
            rating: req.body.rating,
            });
      
          await blog.save();
          return res.status(201).json(blog.ratings);
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }
      }
        );
      Blogsrouter.get("/blogs/:id/ratings", async (req, res) => {
         {
          const blog = await Blog.findById(req.params.id);
          if(blog.active==false)  return res.status(404).json({message:"Blog not found"});
      
          if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
          }
      
          var rating=0;
         blog.ratings.forEach((element) => {
            rating += element.rating;
            }
            );
            console.log("here");
            rating = rating / blog.ratings.length;
            console.log(rating);
            return res.status(200).json(rating);
        } 
      });

        
  
  
module.exports = Blogsrouter;