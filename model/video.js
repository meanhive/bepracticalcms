const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const VideoSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    videoUrl: { type: Array, required: true, unique: true },
    thumbnailUrl: { type: String, required: true },
    courseTitle: { type: String, required: true },
    batchId: { type: String, required: true },
    batchTime: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'videos',
  }
);

VideoSchema.plugin(uniqueValidator, { message: 'video is already taken' });

module.exports = mongoose.model('Video', VideoSchema);
