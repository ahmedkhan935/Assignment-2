const express = require('express');
const Adminrouter = express.Router();
const User = require('../models/user');
const Blog =  require('../models/blog');

Adminrouter.use('/', require('../Middleware/authmidlleware'));
Adminrouter.use('/', require('../Middleware/adminmiddleware'));

// View all users
Adminrouter.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block/Disable a user
Adminrouter.put('/users/block/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.active = false;
    await user.save();
    res.json({ message: 'User has been blocked/disabled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all Blog Posts
Adminrouter.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View a particular Blog Post
Adminrouter.get('/blogs/:blogId', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disable a blog
Adminrouter.put('/blogs/:blogId/disable', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    blog.active = false;
    await blog.save();
    res.json({ message: 'Blog has been disabled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = Adminrouter;
