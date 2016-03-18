'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  title_slug: {
    type: String,
    required: true,
    trim: true
  },
  sort_id: {
    type: Number,
    required: true,
    trim: true
  },
  category: {
    type: {},
    required: true,
    trim: true
  },
  address: {
    type: {},
    required: true,
    trim: true
  },
  status: {
    type: {},
    required: false,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: {
    type: Array
  },
  updated: {
    type: Array
  }
});

/**
 * Validations
 */
ArticleSchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

ArticleSchema.path('title_slug').validate(function(title_slug) {
  return !!title_slug;
}, 'title_slug cannot be blank');

ArticleSchema.path('sort_id').validate(function(sort_id) {
  return !!sort_id;
}, 'sort_id cannot be blank');

ArticleSchema.path('category').validate(function(category) {
  return !!category;
}, 'category cannot be blank');

ArticleSchema.path('address').validate(function(address) {
  return !!address;
}, 'address cannot be blank');

ArticleSchema.path('status').validate(function(status) {
  return !!status;
}, 'status cannot be blank');

ArticleSchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
ArticleSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Article', ArticleSchema);
