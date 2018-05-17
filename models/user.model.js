'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    hash: {
      type: String,
      required: true
    },
    roles: [{ type: String, enum: ['ADMIN', 'SUPERVISOR', 'TECHNICIAN'] }],
    enabled: {
      type: Boolean,
      default: true
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: String,
    department: String,
    unit: {
      type: Number,
      ref: 'Unit'
    }
  },
  { collection: 'users' }
);

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hash(password, saltRounds); // return promise
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.hash); // return promise
};

userSchema.methods.excludeFields = function() {
  return _.omit(this.toObject(), ['hash']);
};

module.exports = mongoose.model('User', userSchema);
