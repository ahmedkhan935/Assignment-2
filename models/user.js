const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: {
    type: [{
        email: {
            type: String,
        },
        username: {
            type: String,
        },
        }],
      },
  following: {
    type: [{
        email: {
            type: String,
        },
        username: {
            type: String,
        },
        }],
      },
      notifications: {
        type: [String],
          },
          active: {
            type: Boolean,
            required: true,
          },
    role: {
      type: String,
      default: 'user',
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
