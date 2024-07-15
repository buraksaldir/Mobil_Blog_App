const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'please add post title'],
    },
    description: {
      type: String,
      required: [true, 'please add post description'],
    },
    image: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
