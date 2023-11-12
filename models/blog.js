const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    unique: true,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  comments: [
    {
      email: {
        type: String,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
  ratings: {
    type: [{
        email: {
            type: String,
        },
        rating: {
            type: Number,
            required: true,
        },
        }],
      },
    category: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
