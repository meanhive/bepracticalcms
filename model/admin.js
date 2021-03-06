const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const AdminSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      sparse: true,
    },
    password: { type: String, required: true, select: false },
    userType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'admin',
  }
);

AdminSchema.plugin(uniqueValidator, { message: 'is already taken' });

module.exports = mongoose.model('Admin', AdminSchema);
