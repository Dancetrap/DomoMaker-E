const mongoose = require('mongoose');
const _ = require('underscore');
// const { Domo } = require('../controllers');

let DomoModel = {};

const setName = (name) => _.escape(name).trim();
const setFact = (fact) => _.escape(fact).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    require: true,
  },
  fact: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 100,
    set: setFact,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  fact: doc.fact,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };
  // console.log(ownerId);
  return DomoModel.find(search).select('name age fact').lean().exec(callback);

  // console.log(ownerId);
  // return DomoModel.findById(ownerId).exec(callback);
};

DomoSchema.statics.findByOwnerAndDelete = async (id, callback) => {
  const search = {
    _id: mongoose.Types.ObjectId(id),
  };

  // eslint-disable-next-line no-return-await
  return await DomoModel.find(search).exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = DomoModel;
