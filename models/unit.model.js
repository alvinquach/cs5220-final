'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let unitSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      unique: true,
      required: true
    },
    location: String,
    email: String,
    description: String,
    phone: String,
    supervisors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    technicians: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { collection: 'units' }
);

module.exports = mongoose.model('Unit', unitSchema);
