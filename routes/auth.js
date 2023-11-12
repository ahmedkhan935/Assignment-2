const express = require('express');
const Authrouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
Authrouter.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      followers: [],
      following: [],
      notifications: [],
      active: true,
      role: req.body.role,
    });
    const savedUser = await user.save();
    res.json({ user: savedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
Authrouter.post('/login', async (req, res) => 
{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email:email,active:true });
    if(!user)
    {
        return res.status(400).json({message:"Email is not found"});
    }
    const validPass = await bcrypt.compare(password,user.password);
    if(!validPass)
    {
        return res.status(400).json({message:"Invalid Password"});
    }
    const token = jwt.sign({email:user.email},process.env.TOKEN);
    res.send({token:token});

});
Authrouter.post("/change-password",async(req,res)=>{ 
  const email=req.body.email;
  const password=req.body.password;
  const newpassword=req.body.newpassword;
  const user=await User.findOne({email:email});
  const validPass = await bcrypt.compare(password,user.password);
  if(!validPass)
  {
      return res.status(400).json({message:"Invalid Password"});
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, salt);
  user.password=hashedPassword;
  await user.save();
  res.json({message:"Password changed successfully"});
}); 
module.exports=Authrouter;